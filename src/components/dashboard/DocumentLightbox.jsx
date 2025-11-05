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

  if (!isOpen || !documents || documents.length === 0) return null

  const currentDoc = documents[currentIndex]

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
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all text-white z-10"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-2 z-10">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <span className="text-white font-medium px-2 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {!isPDF && (
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-all text-white ml-2"
            aria-label="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={handleDownload}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-all text-white ml-2"
          aria-label="Download"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Document counter */}
      {documents.length > 1 && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-medium">
          {currentIndex + 1} / {documents.length}
        </div>
      )}

      {/* Navigation buttons */}
      {documents.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous document"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === documents.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next document"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Document viewer */}
      <div
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {isPDF ? (
          <iframe
            src={currentDoc.url}
            className="w-full h-[90vh] bg-white rounded-lg"
            title={currentDoc.name || 'Document'}
          />
        ) : (
          <img
            src={currentDoc.url}
            alt={currentDoc.name || 'Document'}
            className="max-w-full max-h-full object-contain select-none"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
            draggable={false}
          />
        )}
      </div>

      {/* Document name */}
      {currentDoc.name && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-medium max-w-md truncate">
          {currentDoc.name}
        </div>
      )}
    </div>
  )
}

export default DocumentLightbox
