"use client"
import { useState, useEffect, useCallback } from 'react'
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
  FileImage,
  Copy,
  Trash2,
  Move
} from 'lucide-react'
import Image from "next/image"
import DashboardPageWrapper from '../../../components/dashboard/DashboardPageWrapper'

const CATEGORIES = [
  'Infantwear',
  'Kidswear', 
  'Menswear',
  'Womenswear',
  'Typography',
  'Floral',
  'AI-Generated'
]

const MAX_DESIGNS = 25
const MAX_PREVIEW_IMAGES = 5

const UploadContent = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [uploadResults, setUploadResults] = useState(null)
  const [isFirstTimeUpload, setIsFirstTimeUpload] = useState(false)
  const [minDesignsRequired, setMinDesignsRequired] = useState(1)

  // Designs state (always batch mode now)
  const [designs, setDesigns] = useState([{
    id: 1,
    title: '',
    description: '',
    category: '',
    tags: '',
    previewImages: [],
    previewImageUrls: [],
    rawFile: null,
    errors: {}
  }])

  const [globalErrors, setGlobalErrors] = useState({})
  const [expandedDesigns, setExpandedDesigns] = useState(new Set([0])) // First design expanded by default

  // Check if user is first-time uploader
  const checkFirstTimeUpload = useCallback(async () => {
    try {
      const response = await fetch('/api/designs/my-designs?limit=1')
      const data = await response.json()
      if (data.success && data.stats) {
        const isFirstTime = data.stats.totalDesigns === 0
        setIsFirstTimeUpload(isFirstTime)
        setMinDesignsRequired(isFirstTime ? 10 : 1)
        
        // If first time and only 1 design, add more to meet minimum
        if (isFirstTime && designs.length < 10) {
          const additionalDesigns = Array.from({ length: 10 - designs.length }, (_, i) => ({
            id: Date.now() + i,
            title: '',
            description: '',
            category: '',
            tags: '',
            previewImages: [],
            previewImageUrls: [],
            rawFile: null,
            errors: {}
          }))
          setDesigns(prev => [...prev, ...additionalDesigns])
        }
      }
    } catch (error) {
      console.error('Error checking first-time upload status:', error)
    }
  }, [designs.length])

  const updateDesign = (index, field, value) => {
    setDesigns(prev => 
      prev.map((design, i) => 
        i === index 
          ? { ...design, [field]: value, errors: { ...design.errors, [field]: '' } }
          : design
      )
    )
  }

  // Load first-time upload status on component mount
  useEffect(() => {
    checkFirstTimeUpload()
  }, [checkFirstTimeUpload])

  const addDesign = () => {
    if (designs.length >= MAX_DESIGNS) return

    const newIndex = designs.length
    setDesigns(prev => [
      ...prev,
      {
        id: Date.now(),
        title: '',
        description: '',
        category: '',
        tags: '',
        previewImages: [],
        previewImageUrls: [],
        rawFile: null,
        errors: {}
      }
    ])
    // Expand the newly added design
    setExpandedDesigns(prev => new Set([...prev, newIndex]))
  }

  const removeDesign = (index) => {
    // Don't allow removing designs if it would go below minimum required
    if (designs.length <= minDesignsRequired) return
    setDesigns(prev => prev.filter((_, i) => i !== index))
    // Remove from expanded set and adjust indices
    setExpandedDesigns(prev => {
      const newSet = new Set()
      prev.forEach(i => {
        if (i < index) newSet.add(i)
        else if (i > index) newSet.add(i - 1)
      })
      return newSet
    })
  }

  const duplicateDesign = (index) => {
    if (designs.length >= MAX_DESIGNS) return
    
    const designToDuplicate = designs[index]
    setDesigns(prev => [
      ...prev,
      {
        ...designToDuplicate,
        id: Date.now(),
        title: designToDuplicate.title + ' (Copy)',
        previewImages: [], // Don't duplicate files
        previewImageUrls: [],
        rawFile: null,
        errors: {}
      }
    ])
  }

  const toggleDesignExpanded = (index) => {
    setExpandedDesigns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const expandAll = () => {
    setExpandedDesigns(new Set(designs.map((_, index) => index)))
  }

  const collapseAll = () => {
    setExpandedDesigns(new Set())
  }

  const handlePreviewImagesChange = (designIndex, files) => {
    setDesigns(prev => {
      const design = prev[designIndex]
      const currentCount = design.previewImages.length
      const availableSlots = MAX_PREVIEW_IMAGES - currentCount

      if (availableSlots <= 0) {
        return prev
      }

      const validFiles = []
      const validUrls = []
      const errors = []

      Array.from(files).forEach((file, fileIndex) => {
        // Stop if we've reached the max limit
        if (validFiles.length >= availableSlots) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp']
        const fileExtension = file.name.split('.').pop().toLowerCase()

        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
          errors.push(`${file.name}: Please select a JPG, PNG, or WebP image`)
          return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name}: Image must be less than 5MB`)
          return
        }

        validFiles.push(file)
        validUrls.push(URL.createObjectURL(file))
      })

      return prev.map((d, i) =>
        i === designIndex
          ? {
              ...d,
              previewImages: [...d.previewImages, ...validFiles],
              previewImageUrls: [...d.previewImageUrls, ...validUrls],
              errors: { ...d.errors, previewImages: errors.length > 0 ? errors.join(', ') : '' }
            }
          : d
      )
    })
  }

  const removePreviewImage = (designIndex, imageIndex) => {
    setDesigns(prev =>
      prev.map((design, i) =>
        i === designIndex
          ? {
              ...design,
              previewImages: design.previewImages.filter((_, j) => j !== imageIndex),
              previewImageUrls: design.previewImageUrls.filter((_, j) => j !== imageIndex)
            }
          : design
      )
    )
  }

  const movePreviewImage = (designIndex, fromIndex, toIndex) => {
    setDesigns(prev =>
      prev.map((design, i) => {
        if (i !== designIndex) return design

        const newPreviewImages = [...design.previewImages]
        const newPreviewImageUrls = [...design.previewImageUrls]

        // Remove from old position
        const [movedImage] = newPreviewImages.splice(fromIndex, 1)
        const [movedUrl] = newPreviewImageUrls.splice(fromIndex, 1)

        // Insert at new position
        newPreviewImages.splice(toIndex, 0, movedImage)
        newPreviewImageUrls.splice(toIndex, 0, movedUrl)

        return {
          ...design,
          previewImages: newPreviewImages,
          previewImageUrls: newPreviewImageUrls
        }
      })
    )
  }

  const handleRawFileChange = (designIndex, file) => {
    if (!file) return

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      const error = 'Raw file must be less than 50MB'
      setDesigns(prev => 
        prev.map((design, i) => 
          i === designIndex 
            ? { ...design, errors: { ...design.errors, rawFile: error } }
            : design
        )
      )
      return
    }

    // Validate file type
    const allowedExtensions = ['pdf', 'ai', 'cdr', 'eps', 'svg']
    const extension = file.name.split('.').pop().toLowerCase()

    if (!allowedExtensions.includes(extension)) {
      const error = 'Unsupported file format. Please use PDF, AI, CDR, EPS, or SVG'
      setDesigns(prev => 
        prev.map((design, i) => 
          i === designIndex 
            ? { ...design, errors: { ...design.errors, rawFile: error } }
            : design
        )
      )
      return
    }

    updateDesign(designIndex, 'rawFile', file)
  }

  const validateDesign = (design) => {
    const errors = {}

    if (!design.title.trim()) errors.title = 'Title is required'
    if (!design.description.trim()) errors.description = 'Description is required'
    if (!design.category) errors.category = 'Category is required'
    if (design.previewImages.length === 0) errors.previewImages = 'At least one preview image is required'
    if (!design.rawFile) errors.rawFile = 'Raw file is required'

    return errors
  }

  const validateAllDesigns = () => {
    let hasErrors = false
    const errors = {}

    // Check minimum designs requirement - strict check
    if (designs.length < minDesignsRequired) {
      errors.submit = `${isFirstTimeUpload ? 'First-time uploaders must' : 'You must'} upload at least ${minDesignsRequired} design${minDesignsRequired > 1 ? 's' : ''}. You currently have ${designs.length} design${designs.length > 1 ? 's' : ''}.`
      hasErrors = true
    }

    // Validate each design
    setDesigns(prev =>
      prev.map(design => {
        const designErrors = validateDesign(design)
        if (Object.keys(designErrors).length > 0) {
          hasErrors = true
        }
        return { ...design, errors: designErrors }
      })
    )

    // Set global errors after design validation
    if (hasErrors) {
      setGlobalErrors(errors)
    } else {
      setGlobalErrors({})
    }

    return !hasErrors
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
    }, 300)
    
    return interval
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Submit attempt:', {
      designsCount: designs.length,
      minRequired: minDesignsRequired,
      isFirstTime: isFirstTimeUpload
    })

    if (!validateAllDesigns()) {
      console.log('Validation failed, not submitting')
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)
    setSuccess(false)
    setGlobalErrors({})
    
    const progressInterval = simulateProgress()

    try {
      // Always use batch upload now
      const formData = new FormData()
      formData.append('designCount', designs.length.toString())
      
      designs.forEach((design, designIndex) => {
        formData.append(`design_${designIndex}_title`, design.title.trim())
        formData.append(`design_${designIndex}_description`, design.description.trim())
        formData.append(`design_${designIndex}_category`, design.category)
        formData.append(`design_${designIndex}_tags`, design.tags.trim())
        
        // Add multiple preview images for this design
        design.previewImages.forEach((file, imageIndex) => {
          formData.append(`design_${designIndex}_preview_${imageIndex}`, file)
        })
        
        formData.append(`design_${designIndex}_raw`, design.rawFile)
      })

      const response = await fetch('/api/designs/batch-upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setUploadResults(result)

      console.log('Upload result:', result)

      if (!result.success && result.totalUploaded === 0) {
        // All uploads failed
        const errorMessages = result.errors?.map(err => err.message || err.error).join('\n') || 'All uploads failed'
        throw new Error(errorMessages)
      }

      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Show success even if some failed
      setTimeout(() => {
        setSuccess(true)
        // Stay on success screen longer if there were failures
        const delay = result.totalFailed > 0 ? 5000 : 3000
        setTimeout(() => {
          router.push('/dashboard/my-designs')
        }, delay)
      }, 500)

    } catch (error) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      console.error('Upload error:', error)
      setGlobalErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop().toLowerCase()
    const iconClass = "w-4 h-4"
    
    switch(ext) {
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h2>

          {uploadResults && (
            <div className="space-y-4 mb-6">
              {/* Success Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  {uploadResults.totalUploaded} design(s) uploaded successfully
                </p>
              </div>

              {/* Failure Summary */}
              {uploadResults.totalFailed > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-medium mb-2">
                    {uploadResults.totalFailed} design(s) failed to upload
                  </p>
                  {uploadResults.errors && uploadResults.errors.length > 0 && (
                    <div className="mt-3 text-left">
                      <p className="text-sm text-orange-700 font-medium mb-2">Failed designs:</p>
                      <ul className="text-sm text-orange-600 space-y-1 max-h-40 overflow-y-auto">
                        {uploadResults.errors.map((err, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{err.message || err.error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="text-gray-600 mb-2">
            {uploadResults?.totalUploaded > 0
              ? 'Your uploaded design(s) are pending approval.'
              : 'Please check the errors and try again.'}
          </p>
          <p className="text-sm text-gray-500">
            {uploadResults?.totalUploaded > 0
              ? 'Redirecting to your designs...'
              : 'You can fix the issues and re-upload.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-md">
        <h1 className="text-3xl font-bold mb-2">Upload Designs</h1>
        <p className="text-purple-100">Share your creative work with our community</p>
        {isFirstTimeUpload && (
          <div className="mt-4 bg-orange-500/20 border border-orange-300/30 rounded-lg p-3">
            <p className="text-orange-100 text-sm">
              <strong>First-time upload:</strong> You need to upload at least 10 designs to get started.
            </p>
          </div>
        )}
      </div>

      {/* Upload Info */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-orange-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isFirstTimeUpload ? 'Initial Upload' : 'Design Upload'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isFirstTimeUpload
                ? `Upload ${minDesignsRequired} designs minimum (up to ${MAX_DESIGNS} designs allowed)`
                : `Upload 1-${MAX_DESIGNS} designs at once`
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            {designs.length > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Collapse All
                </button>
              </div>
            )}
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{designs.length}</div>
              <div className="text-sm text-gray-500">
                {isFirstTimeUpload ? `of ${minDesignsRequired} min` : 'designs'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Error Display - At top of form */}
      {globalErrors.submit && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-1">Upload Requirements Not Met</h3>
              <p className="text-red-700">{globalErrors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Design Forms */}
        {designs.map((design, designIndex) => (
          <DesignForm
            key={design.id}
            design={design}
            designIndex={designIndex}
            isOnly={designs.length === 1}
            canRemove={designs.length > minDesignsRequired}
            isFirstTimeUpload={isFirstTimeUpload}
            isExpanded={expandedDesigns.has(designIndex)}
            onToggleExpand={() => toggleDesignExpanded(designIndex)}
            onUpdate={updateDesign}
            onPreviewImagesChange={handlePreviewImagesChange}
            onRemovePreviewImage={removePreviewImage}
            onMovePreviewImage={movePreviewImage}
            onRawFileChange={handleRawFileChange}
            onRemove={() => removeDesign(designIndex)}
            onDuplicate={() => duplicateDesign(designIndex)}
            getFileIcon={getFileIcon}
          />
        ))}

        {/* Add More Designs */}
        {designs.length < MAX_DESIGNS && (
          <div className="text-center">
            <button
              type="button"
              onClick={addDesign}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Design ({designs.length}/{MAX_DESIGNS})
            </button>
          </div>
        )}

        {/* Global Errors */}
        {globalErrors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{globalErrors.submit}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Uploading... {uploadProgress.toFixed(0)}%
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                {designs.length === 1 ? 'Upload Design' : `Upload ${designs.length} Designs`}
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </form>
    </div>
  )
}

// Individual Design Form Component
const DesignForm = ({
  design,
  designIndex,
  isOnly,
  canRemove,
  isFirstTimeUpload,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onPreviewImagesChange,
  onRemovePreviewImage,
  onMovePreviewImage,
  onRawFileChange,
  onRemove,
  onDuplicate,
  getFileIcon
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
      {/* Design Header - Always visible */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
          >
            {isExpanded ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-medium bg-clip-text flex items-center">
              {/* <Type className="w-5 h-5 mr-2 text-purple-600" /> */}
              Design #{designIndex + 1}
              {design.title && (
                <span className="ml-2 text-base text-gray-800 font-medium">
                  - {design.title}
                </span>
              )}
              {isFirstTimeUpload && designIndex < 10 && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  Required
                </span>
              )}
            </h2>
            {!isExpanded && (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {design.category && (
                  <span className="flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    {design.category}
                  </span>
                )}
                {design.previewImages.length > 0 && (
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {design.previewImages.length} image{design.previewImages.length !== 1 ? 's' : ''}
                  </span>
                )}
                {design.rawFile && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {design.rawFile.name}
                  </span>
                )}
                {(!design.title || !design.category || design.previewImages.length === 0 || !design.rawFile) && (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Incomplete
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          {/* <button
            type="button"
            onClick={onDuplicate}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Duplicate design"
          >
            <Copy className="w-4 h-4" />
          </button> */}
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove design"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={design.title}
              onChange={(e) => onUpdate(designIndex, 'title', e.target.value)}
              placeholder="Enter design title"
              className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
              maxLength={100}
            />
            {design.errors.title && <p className="text-red-500 text-sm mt-1">{design.errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={design.category}
              onChange={(e) => onUpdate(designIndex, 'category', e.target.value)}
              className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {design.errors.category && <p className="text-red-500 text-sm mt-1">{design.errors.category}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={design.description}
            onChange={(e) => onUpdate(designIndex, 'description', e.target.value)}
            placeholder="Describe your design..."
            rows={4}
            className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
            maxLength={1000}
          />
          {design.errors.description && <p className="text-red-500 text-sm mt-1">{design.errors.description}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={design.tags}
            onChange={(e) => onUpdate(designIndex, 'tags', e.target.value)}
            placeholder="modern, elegant, creative..."
            className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Preview Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <ImageIcon className="w-4 h-4 inline mr-1" />
            Preview Images * (1-{MAX_PREVIEW_IMAGES} images, JPG/PNG/WebP, Max 5MB each)
          </label>
          
          <div className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-gradient-to-br from-orange-50 to-amber-50">
            {design.previewImageUrls.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">First image will be shown as primary preview. Drag to reorder.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {design.previewImageUrls.map((url, imageIndex) => (
                    <div
                      key={imageIndex}
                      className="relative group"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move'
                        e.dataTransfer.setData('imageIndex', imageIndex)
                        e.dataTransfer.setData('designIndex', designIndex)
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.dataTransfer.dropEffect = 'move'
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        const fromIndex = parseInt(e.dataTransfer.getData('imageIndex'))
                        const fromDesignIndex = parseInt(e.dataTransfer.getData('designIndex'))
                        if (fromDesignIndex === designIndex && fromIndex !== imageIndex) {
                          onMovePreviewImage(designIndex, fromIndex, imageIndex)
                        }
                      }}
                    >
                      <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden cursor-move border-2 border-transparent hover:border-purple-400 transition-colors">
                        <Image
                          src={url}
                          alt={`Preview ${imageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                        {imageIndex === 0 && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                            Primary
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          {imageIndex + 1}
                        </div>
                      </div>

                      {/* Reorder buttons */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {imageIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => onMovePreviewImage(designIndex, imageIndex, imageIndex - 1)}
                            className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            title="Move left"
                          >
                            <span className="text-xs">←</span>
                          </button>
                        )}
                        {imageIndex < design.previewImageUrls.length - 1 && (
                          <button
                            type="button"
                            onClick={() => onMovePreviewImage(designIndex, imageIndex, imageIndex + 1)}
                            className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            title="Move right"
                          >
                            <span className="text-xs">→</span>
                          </button>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => onRemovePreviewImage(designIndex, imageIndex)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {design.previewImageUrls.length < MAX_PREVIEW_IMAGES && (
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => onPreviewImagesChange(designIndex, e.target.files)}
                      className="hidden"
                      id={`additional-preview-${designIndex}`}
                    />
                    <label
                      htmlFor={`additional-preview-${designIndex}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Images ({design.previewImageUrls.length}/{MAX_PREVIEW_IMAGES})
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload preview images</p>
                <p className="text-sm text-gray-500 mb-4">First image will be the primary preview</p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => onPreviewImagesChange(designIndex, e.target.files)}
                  className="hidden"
                  id={`preview-${designIndex}`}
                />
                <label
                  htmlFor={`preview-${designIndex}`}
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer"
                >
                  Choose Images
                </label>
              </>
            )}
          </div>
          {design.errors.previewImages && <p className="text-red-500 text-sm mt-2">{design.errors.previewImages}</p>}
        </div>

        {/* Raw File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FileText className="w-4 h-4 inline mr-1" />
            Raw File * (PDF, AI, CDR, EPS, SVG - Max 50MB)
          </label>
          
          <div className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-gradient-to-br from-orange-50 to-amber-50">
            {design.rawFile ? (
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getFileIcon(design.rawFile.name)}
                  <span className="text-sm font-medium">{design.rawFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(design.rawFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdate(designIndex, 'rawFile', null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload raw file</p>
                <p className="text-sm text-gray-500 mb-4">Source files for your design</p>
                <input
                  type="file"
                  accept=".pdf,.ai,.cdr,.eps,.svg"
                  onChange={(e) => onRawFileChange(designIndex, e.target.files[0])}
                  className="hidden"
                  id={`raw-${designIndex}`}
                />
                <label
                  htmlFor={`raw-${designIndex}`}
                  className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all cursor-pointer"
                >
                  Choose File
                </label>
              </>
            )}
          </div>
          {design.errors.rawFile && <p className="text-red-500 text-sm mt-2">{design.errors.rawFile}</p>}
        </div>
        </div>
      )}
    </div>
  )
}

const UploadPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="designer">
      <UploadContent />
    </DashboardPageWrapper>
  )
}

export default UploadPage