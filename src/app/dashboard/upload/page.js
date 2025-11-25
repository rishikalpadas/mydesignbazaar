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

const MAX_DESIGNS = 10
const MAX_PREVIEW_IMAGES = 5

const UploadContent = ({ user }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [uploadResults, setUploadResults] = useState(null)
  const [isFirstTimeUpload, setIsFirstTimeUpload] = useState(false)
  const [minDesignsRequired, setMinDesignsRequired] = useState(1)
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(-1)
  const [designUploadStatus, setDesignUploadStatus] = useState([])

  // Designs state (always batch mode now)
  const [designs, setDesigns] = useState([{
    id: 1,
    title: '',
    description: '',
    category: '',
    tags: '',
    exclusiveRequest: false,
    previewImages: [],
    previewImageUrls: [],
    rawFile: null,
    errors: {}
  }])
  const [globalErrors, setGlobalErrors] = useState({})
  const [expandedDesigns, setExpandedDesigns] = useState(new Set([0])) // First design expanded by default
  const [checkingDuplicates, setCheckingDuplicates] = useState(false)
  const [duplicateCheckResults, setDuplicateCheckResults] = useState(null)

  // Check if user is first-time uploader
  useEffect(() => {
    const checkFirstTimeUpload = async () => {
      try {
        const response = await fetch('/api/designs/check-first-upload')
        const data = await response.json()
        
        if (data.success) {
          console.log('First-time upload check:', {
            isFirstTimeUpload: data.isFirstTimeUpload,
            totalDesigns: data.totalDesigns,
            minDesignsRequired: data.minDesignsRequired
          })
          setIsFirstTimeUpload(data.isFirstTimeUpload)
          setMinDesignsRequired(data.minDesignsRequired)
          
          // If first time, initialize with 2 designs (only if we currently have 1)
          if (data.isFirstTimeUpload) {
            setDesigns(prev => {
              // Only initialize if we still have just 1 design
              if (prev.length === 1) {
                const additionalDesigns = Array.from({ length: 1 }, (_, i) => ({
                  id: Date.now() + i,
                  title: '',
                  description: '',
                  category: '',
                  tags: '',
                  exclusiveRequest: false,
                  previewImages: [],
                  previewImageUrls: [],
                  rawFile: null,
                  errors: {}
                }))
                return [...prev, ...additionalDesigns]
              }
              return prev
            })
          }
        }
      } catch (error) {
        console.error('Error checking first-time upload status:', error)
      }
    }

    checkFirstTimeUpload()
  }, [])

  const updateDesign = (index, field, value) => {
    setDesigns(prev => 
      prev.map((design, i) => 
        i === index 
          ? { ...design, [field]: value, errors: { ...design.errors, [field]: '' } }
          : design
      )
    )
  }

  const addDesign = () => {
    if (designs.length >= MAX_DESIGNS) {
      setGlobalErrors(prev => ({
        ...prev,
        maxDesigns: `Maximum ${MAX_DESIGNS} designs allowed per upload`
      }))
      return
    }

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
    // Clear max designs error if it exists
    setGlobalErrors(prev => {
      const { maxDesigns, ...rest } = prev
      return rest
    })
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

    // Calculate total upload size including this file
    const totalSize = designs.reduce((total, design, idx) => {
      const previewSizes = design.previewImages.reduce((sum, img) => sum + img.size, 0)
      const rawSize = idx === designIndex ? file.size : (design.rawFile?.size || 0)
      return total + previewSizes + rawSize
    }, 0)

    // Show warning if total size is approaching limit (400MB)
    if (totalSize > 400 * 1024 * 1024) {
      setGlobalErrors(prev => ({
        ...prev,
        sizeWarning: 'Total upload size is approaching the limit. Consider uploading fewer designs or smaller files.'
      }))
    } else {
      setGlobalErrors(prev => {
        const { sizeWarning, ...rest } = prev
        return rest
      })
    }

    // Validate individual file size (50MB)
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

    // Check max designs limit
    if (designs.length > MAX_DESIGNS) {
      errors.submit = `Maximum ${MAX_DESIGNS} designs allowed per upload. You currently have ${designs.length} design${designs.length > 1 ? 's' : ''}.`
      hasErrors = true
    }

    // Enforce minimum 2 designs for first-time uploaders only
    if (isFirstTimeUpload && designs.length < 2) {
      errors.submit = `First-time uploaders must upload at least 2 designs. You currently have ${designs.length} design${designs.length > 1 ? 's' : ''}.`
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

  const checkForDuplicates = async () => {
    setCheckingDuplicates(true)
    setDuplicateCheckResults(null)
    setGlobalErrors({})

    try {
      const formData = new FormData()
      let imageCounter = 0

      // Add all images from all designs
      for (let designIndex = 0; designIndex < designs.length; designIndex++) {
        const design = designs[designIndex]
        
        for (let imageIndex = 0; imageIndex < design.previewImages.length; imageIndex++) {
          const imageFile = design.previewImages[imageIndex]
          
          formData.append(`image_${imageCounter}`, imageFile)
          formData.append(`designIndex_${imageCounter}`, designIndex.toString())
          formData.append(`imageIndex_${imageCounter}`, imageIndex.toString())
          
          imageCounter++
        }
      }

      console.log(`[DUPLICATE-CHECK] Checking ${imageCounter} images for duplicates`)

      const response = await fetch('/api/designs/check-duplicates', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      console.log('[DUPLICATE-CHECK] Response status:', response.status)
      console.log('[DUPLICATE-CHECK] Response data:', result)

      if (!response.ok) {
        console.error('[DUPLICATE-CHECK] API Error:', result)
        throw new Error(result.error || result.details || 'Failed to check for duplicates')
      }

      setDuplicateCheckResults(result)
      return result

    } catch (error) {
      console.error('Duplicate check error:', error)
      setGlobalErrors({ 
        submit: `Duplicate check failed: ${error.message}. Please try again.` 
      })
      return { error: error.message, hasDuplicates: false }
    } finally {
      setCheckingDuplicates(false)
    }
  }

  const uploadSingleDesign = async (design, designIndex, totalDesigns) => {
    const formData = new FormData()

    // Add design metadata
    formData.append('title', design.title.trim())
    formData.append('description', design.description.trim())
    formData.append('category', design.category)
    formData.append('tags', design.tags.trim())
    formData.append('exclusiveRequest', design.exclusiveRequest ? 'true' : 'false')
    formData.append('designIndex', designIndex.toString())
    formData.append('totalDesigns', totalDesigns.toString())
    formData.append('isFirstTimeUpload', isFirstTimeUpload.toString())

    // Add preview images
    design.previewImages.forEach((file, imageIndex) => {
      formData.append(`preview_${imageIndex}`, file)
    })

    // Add raw file
    formData.append('raw', design.rawFile)

    const response = await fetch('/api/designs/single-upload', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    return { response, result }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Log submission attempt
    console.log('Submit attempt:', {
      designsCount: designs.length,
      minRequired: minDesignsRequired,
      isFirstTime: isFirstTimeUpload,
      totalFileSize: designs.reduce((total, design) => {
        const previewSizes = design.previewImages.reduce((sum, file) => sum + file.size, 0)
        const rawSize = design.rawFile ? design.rawFile.size : 0
        return total + previewSizes + rawSize
      }, 0) / (1024 * 1024) + ' MB'
    })

    if (!validateAllDesigns()) {
      console.log('Validation failed, not submitting')
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Check for duplicate images before uploading
    console.log('[UPLOAD] Running duplicate check...')
    const duplicateCheckResult = await checkForDuplicates()
    
    if (duplicateCheckResult.error) {
      console.error('[UPLOAD] Duplicate check failed:', duplicateCheckResult.error)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (duplicateCheckResult.hasDuplicates) {
      console.log('[UPLOAD] Duplicates found, blocking upload')
      setGlobalErrors({ 
        submit: 'Duplicate images detected. Please review and remove duplicate images before uploading.' 
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    console.log('[UPLOAD] No duplicates found, proceeding with upload')

    setLoading(true)
    setSuccess(false)
    setGlobalErrors({})
    setUploadProgress(0)
    setDuplicateCheckResults(null)

    // Initialize upload status for each design
    const initialStatus = designs.map(() => ({ status: 'pending', error: null, design: null }))
    setDesignUploadStatus(initialStatus)

    const uploadedDesigns = []
    const errors = []

    try {
      // Upload designs one by one
      for (let i = 0; i < designs.length; i++) {
        const design = designs[i]

        // Update current uploading index
        setCurrentUploadingIndex(i)

        // Update status to uploading
        setDesignUploadStatus(prev =>
          prev.map((status, idx) =>
            idx === i ? { ...status, status: 'uploading' } : status
          )
        )

        console.log(`Uploading design ${i + 1}/${designs.length}: ${design.title}`)

        try {
          const { response, result } = await uploadSingleDesign(design, i, designs.length)

          if (result.success) {
            console.log(`Design ${i + 1} uploaded successfully:`, result.design)
            uploadedDesigns.push(result.design)

            // Update status to success
            setDesignUploadStatus(prev =>
              prev.map((status, idx) =>
                idx === i ? { status: 'success', error: null, design: result.design } : status
              )
            )
          } else {
            console.error(`Design ${i + 1} failed:`, result.error)
            errors.push({
              designIndex: i,
              title: design.title,
              error: result.error,
              isDuplicate: result.isDuplicate,
              matchedDesign: result.matchedDesign
            })

            // Update status to failed
            setDesignUploadStatus(prev =>
              prev.map((status, idx) =>
                idx === i ? { status: 'failed', error: result.error } : status
              )
            )
          }
        } catch (uploadError) {
          console.error(`Design ${i + 1} upload error:`, uploadError)
          errors.push({
            designIndex: i,
            title: design.title,
            error: uploadError.message || 'Upload failed'
          })

          // Update status to failed
          setDesignUploadStatus(prev =>
            prev.map((status, idx) =>
              idx === i ? { status: 'failed', error: uploadError.message || 'Upload failed' } : status
            )
          )
        }

        // Update overall progress
        const progress = ((i + 1) / designs.length) * 100
        setUploadProgress(progress)
      }

      // All uploads complete
      setCurrentUploadingIndex(-1)

      const uploadResults = {
        success: uploadedDesigns.length > 0,
        message: `${uploadedDesigns.length} design(s) uploaded successfully`,
        uploadedDesigns,
        totalUploaded: uploadedDesigns.length,
        totalFailed: errors.length,
        totalProcessed: designs.length,
        errors: errors.length > 0 ? errors.map(err => ({
          ...err,
          message: `Design #${err.designIndex + 1}${err.title ? ` (${err.title})` : ''}: ${err.error}`
        })) : undefined
      }

      setUploadResults(uploadResults)

      if (uploadedDesigns.length === 0) {
        // All uploads failed
        const errorMessages = errors.map(err => err.error).join('\n') || 'All uploads failed'
        setGlobalErrors({ submit: errorMessages })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setLoading(false)
        return
      }

      // Show success
      setTimeout(() => {
        setSuccess(true)
        // Stay on success screen longer if there were failures
        const delay = errors.length > 0 ? 5000 : 3000
        setTimeout(() => {
          router.push('/dashboard/my-designs')
        }, delay)
      }, 500)

    } catch (error) {
      console.error('Upload error:', error)
      setGlobalErrors({ submit: error.message })
      setLoading(false)
      setUploadProgress(0)
      setCurrentUploadingIndex(-1)
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
        <div className="text-center max-w-3xl w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h2>

          {uploadResults && (
            <div className="space-y-4 mb-6">
              {/* Success Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  {uploadResults.totalUploaded} design{uploadResults.totalUploaded !== 1 ? 's' : ''} uploaded successfully
                </p>
                {uploadResults.totalFailed > 0 && (
                  <p className="text-orange-700 text-sm mt-1">
                    {uploadResults.totalFailed} design{uploadResults.totalFailed !== 1 ? 's' : ''} failed to upload
                  </p>
                )}
              </div>

              {/* Failed Designs */}
              {uploadResults.errors && uploadResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Failed Uploads
                  </h3>
                  <ul className="space-y-1 text-sm text-red-700">
                    {uploadResults.errors.map((err, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{err.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Successful Designs */}
              {uploadResults.uploadedDesigns && uploadResults.uploadedDesigns.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Successfully Uploaded Designs
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    {uploadResults.uploadedDesigns.map((design, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span className="font-medium">{design.title}</span>
                        <span className="text-blue-600 ml-2">({design.status})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <p className="text-gray-600 mb-2">
            {uploadResults?.totalUploaded > 0
              ? 'Your uploaded design(s) are pending approval from admin.'
              : 'All uploads failed. Please check the errors and try again.'}
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

  // Check if user is approved before showing upload form
  if (!user?.isApproved) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-md">
          <h1 className="text-3xl font-bold mb-2">Account Pending Approval</h1>
          <p className="text-orange-100">Your designer account is currently under review</p>
        </div>

        {/* Status Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-orange-100 p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Waiting for Admin Approval
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Thank you for registering as a designer! Your account is currently pending approval by our admin team. 
            Once approved, you'll be able to upload your designs and start sharing your creative work with our community.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-blue-800 text-sm space-y-1 text-left max-w-md mx-auto">
              <li>• Our admin team will review your designer application</li>
              <li>• You'll receive an email notification once approved</li>
              <li>• After approval, you can upload your initial 10 designs</li>
              <li>• Your designs will then be reviewed for content approval</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Edit Profile
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Questions? Contact our support team at support@mydesignbazaar.com
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
          <div className="mt-4 bg-orange-500/20 border border-orange-300/30 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-orange-100 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-lg font-bold text-orange-100 mb-1">First-Time Designer Upload Requirements</h3>
                <div className="space-y-2 text-orange-100">
                  <p className="flex items-center">
                    <span className="font-semibold">Required:</span>
                    <span className="ml-2">Minimum 2 designs must be uploaded together</span>
                  </p>
                  <p className="text-sm">
                    • You cannot upload fewer than 2 designs for your first submission
                    <br />
                    • You can upload up to 10 designs in your first batch
                    <br />
                    • All designs must pass quality checks and follow our guidelines
                  </p>
                  {/* <div className="flex items-center mt-2 bg-orange-500/30 rounded-lg px-3 py-2">
                    <span className="font-semibold">Current Status:</span>
                    <span className="ml-2">
                      {designs.length}/10 designs prepared
                      {designs.length < 10 ? ` (${10 - designs.length} more required)` : ''}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
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
            {/* <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{designs.length}</div>
              <div className="text-sm text-gray-500">
                {isFirstTimeUpload ? `of ${minDesignsRequired} min` : 'designs'}
              </div>
            </div> */}
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

      {/* Duplicate Images Warning */}
      {duplicateCheckResults && duplicateCheckResults.hasDuplicates && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 mb-3">Duplicate Images Detected</h3>
              
              {/* Duplicates within batch */}
              {duplicateCheckResults.duplicatesInBatch > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-red-700 mb-2">
                    Duplicates Within Your Upload ({duplicateCheckResults.duplicatesInBatch}):
                  </h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    {duplicateCheckResults.batchDuplicates.map((dup, idx) => (
                      <li key={idx} className="bg-red-100 p-3 rounded-lg">
                        <div className="font-medium mb-1">
                          ⚠️ Image {dup.current.imageNumber} in Design #{dup.current.designNumber} 
                          <span className="text-red-800"> is a duplicate of </span>
                          Image {dup.duplicate.imageNumber} in Design #{dup.duplicate.designNumber}
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          Files: <span className="font-mono">{dup.current.filename}</span> ≈ <span className="font-mono">{dup.duplicate.filename}</span>
                          <span className="ml-2">({dup.similarity} similar)</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-red-600 mt-2">
                    💡 <strong>Solution:</strong> Remove duplicate images. Each image must be unique across all designs.
                  </p>
                </div>
              )}

              {/* Duplicates from database */}
              {duplicateCheckResults.duplicatesInDatabase > 0 && (
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">
                    Duplicates Found in Your Previous Uploads ({duplicateCheckResults.duplicatesInDatabase}):
                  </h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    {duplicateCheckResults.databaseMatches.map((match, idx) => (
                      <li key={idx} className="bg-red-100 p-3 rounded-lg">
                        <div className="font-medium mb-1">
                          ⚠️ Image {match.uploaded.imageNumber} in Design #{match.uploaded.designNumber}
                          <span className="text-red-800"> already exists in design: </span>
                          <span className="font-semibold">"{match.existingDesign.title}"</span>
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          File: <span className="font-mono">{match.uploaded.filename}</span>
                          <span className="ml-2">({match.similarity} similar)</span>
                          <span className="ml-2 text-gray-600">Design ID: {match.existingDesign.designId}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-red-600 mt-2">
                    💡 <strong>Solution:</strong> You cannot upload images that already exist in your approved or pending designs.
                  </p>
                </div>
              )}

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> We use advanced image matching technology to detect visually similar images, 
                  not just identical filenames. Please ensure all images are unique and original.
                </p>
              </div>
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
            getFileIcon={getFileIcon}
          />
        ))}

        {/* Add More Designs */}
        {designs.length < MAX_DESIGNS && (
          <div className="text-center">
            <button
              type="button"
              onClick={addDesign}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={designs.length >= MAX_DESIGNS}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Design ({designs.length}/{MAX_DESIGNS})
            </button>
            {globalErrors.maxDesigns && (
              <p className="text-red-500 text-sm mt-2">{globalErrors.maxDesigns}</p>
            )}
          </div>
        )}

        {designs.length >= MAX_DESIGNS && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p className="text-amber-700">
              Maximum limit reached. You can upload up to {MAX_DESIGNS} designs at a time.
            </p>
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

        {/* First Time Upload Warning */}
        {isFirstTimeUpload && designs.length < 2 && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-orange-800">First-Time Upload Requirements</h3>
                <p className="text-orange-700 mt-1">
                  As a first-time uploader, you must upload at least 2 designs together. 
                  Currently prepared: {designs.length} design{designs.length !== 1 ? 's' : ''}.
                  {designs.length < 2 ? ` Please add ${2 - designs.length} more design${2 - designs.length !== 1 ? 's' : ''} to meet the minimum requirement.` : ''}
                </p>
              </div>
            </div>
          </div>
        )}



        {/* Submit Button */}
        <div className="text-center">
          {checkingDuplicates && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 font-medium">
                  Checking for duplicate images...
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                This may take a moment. We're analyzing image content to ensure uniqueness.
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || checkingDuplicates || (isFirstTimeUpload && designs.length < 2)}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title={isFirstTimeUpload && designs.length < 2 ? 'First-time uploaders must upload at least 2 designs' : ''}
          >
            {checkingDuplicates ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Checking Duplicates...
              </>
            ) : loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Uploading... {uploadProgress.toFixed(0)}%
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                {isFirstTimeUpload
                  ? `Upload ${designs.length} Design${designs.length > 1 ? 's' : ''}`
                  : 'Upload'
                }
              </>
            )}
          </button>
          {isFirstTimeUpload && designs.length < 2 && (
            <p className="text-sm text-orange-600 mt-2">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              First-time uploaders need at least 2 designs ({designs.length}/2)
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="space-y-4">
            {/* Overall Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-orange-100 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Upload Progress</h3>
                <span className="text-sm font-medium text-purple-600">
                  {uploadProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Uploading {currentUploadingIndex + 1} of {designs.length} designs...
              </p>
            </div>

            {/* Individual Design Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Design Status</h3>
              <div className="space-y-3">
                {designs.map((design, index) => {
                  const status = designUploadStatus[index] || { status: 'pending' }
                  return (
                    <div
                      key={design.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        status.status === 'uploading'
                          ? 'bg-blue-50 border-2 border-blue-300'
                          : status.status === 'success'
                          ? 'bg-green-50 border border-green-200'
                          : status.status === 'failed'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {status.status === 'uploading' && (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0"></div>
                        )}
                        {status.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                        {status.status === 'failed' && (
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        )}
                        {status.status === 'pending' && (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            Design #{index + 1}: {design.title || 'Untitled'}
                          </p>
                          {status.status === 'failed' && status.error && (
                            <p className="text-sm text-red-600 mt-1">{status.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-medium flex-shrink-0 ml-3">
                        {status.status === 'uploading' && (
                          <span className="text-blue-600">Uploading...</span>
                        )}
                        {status.status === 'success' && (
                          <span className="text-green-600">Uploaded</span>
                        )}
                        {status.status === 'failed' && (
                          <span className="text-red-600">Failed</span>
                        )}
                        {status.status === 'pending' && (
                          <span className="text-gray-500">Waiting</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
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

        {/* Exclusive Request */}
        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <input
            type="checkbox"
            id={`exclusive-${designIndex}`}
            checked={design.exclusiveRequest}
            onChange={(e) => onUpdate(designIndex, 'exclusiveRequest', e.target.checked)}
            className="mt-1 w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500 cursor-pointer"
          />
          <label htmlFor={`exclusive-${designIndex}`} className="flex-1 cursor-pointer">
            <span className="text-sm font-medium text-gray-900 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Request to mark as exclusive design
            </span>
            <p className="text-xs text-gray-600 mt-1">
              Exclusive designs are unique and will be marked with a crown icon. The admin will review and approve your request.
            </p>
          </label>
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
      {({ user }) => <UploadContent user={user} />}
    </DashboardPageWrapper>
  )
}


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default UploadPage