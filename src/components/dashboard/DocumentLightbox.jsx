"use client"
import { useState, useEffect } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from "lucide-react"

const DocumentLightbox = ({ isOpen, onClose, documents, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Reset index when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0)
      setZoom(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  useEffect(() => {
    // Reset zoom and rotation when changing documents
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, documents])

  // Safety check: if current document is invalid, close the modal using useEffect
  // Only run this check after a brief delay to avoid race conditions during state transitions
  useEffect(() => {
    if (!isOpen || !documents || documents.length === 0) return

    const timeoutId = setTimeout(() => {
      if (isOpen && documents && documents.length > 0) {
        const currentDoc = documents[currentIndex]
        if (!currentDoc || !currentDoc.url) {
          console.error('DocumentLightbox: Invalid document or missing URL', { currentDoc, currentIndex, documents })
          onClose()
        }
      }
    }, 50) // Small delay to avoid race conditions

    return () => clearTimeout(timeoutId)
  }, [isOpen, currentIndex, documents, onClose])

  if (!isOpen || !documents || documents.length === 0) return null

  const currentDoc = documents[currentIndex]

  // If current doc is invalid, don't render (useEffect will close it)
  if (!currentDoc || !currentDoc.url) {
    return null
  }

  const handleNext = () => {
    if (currentIndex < documents.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleDownload = () => {
    if (!currentDoc || !currentDoc.url) return
    
    const link = document.createElement('a')
    link.href = currentDoc.url
    link.download = currentDoc.name || `document-${currentIndex + 1}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const isPDF = currentDoc.url?.toLowerCase().endsWith('.pdf')

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Document counter */}
            {documents.length > 1 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-black font-medium text-sm">
                {currentIndex + 1} / {documents.length}
              </div>
            )}
            
            {/* Document name */}
            {currentDoc.name && (
              <div className="text-black font-medium truncate">
                {currentDoc.name}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 ml-4">
            {!isPDF && (
              <>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 text-black font-medium text-sm min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </div>
                
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>

                <button
                  onClick={handleRotate}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-black"
                  aria-label="Rotate"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </>
            )}

            <button
              onClick={handleDownload}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-black"
              aria-label="Download"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-black"
              aria-label="Close"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document viewer */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {/* Navigation buttons */}
          {documents.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label="Previous document"
                title="Previous (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === documents.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label="Next document"
                title="Next (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Content */}
          <div
            className="w-full h-full flex items-center justify-center p-8 overflow-auto"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 && !isPDF ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            {isPDF ? (
              <iframe
                src={currentDoc.url}
                className="w-full h-full bg-white rounded-lg shadow-lg"
                title={currentDoc.name || 'Document'}
              />
            ) : (
              <img
                src={currentDoc.url}
                alt={currentDoc.name || 'Document'}
                className="max-w-full max-h-full object-contain select-none shadow-2xl"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
                draggable={false}
              />
            )}
          </div>

          {/* Zoom hint */}
          {!isPDF && zoom <= 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-sm px-4 py-2 rounded-lg">
              Use zoom controls to enlarge the document
            </div>
          )}
        </div>

        {/* Footer with instructions */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {!isPDF && (
                <>
                  <span>💡 Tip: Zoom in and drag to move the image</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">ESC</kbd> to close</span>
              {documents.length > 1 && (
                <span>Use <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">←</kbd> <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">→</kbd> to navigate</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentLightbox
