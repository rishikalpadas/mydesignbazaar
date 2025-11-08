"use client"
import { useState, useEffect, useRef } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight, Move } from "lucide-react"

const DocumentLightbox = ({ isOpen, onClose, documents, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Modal dragging
  const [isModalDragging, setIsModalDragging] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [modalDragStart, setModalDragStart] = useState({ x: 0, y: 0 })
  const modalRef = useRef(null)

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
      // Reset modal to top-right position
      setModalPosition({ x: 0, y: 0 })
    } else {
      // Position modal at top-right when opened
      const modalWidth = 600 // approximate width
      const screenWidth = window.innerWidth
      const rightOffset = 20 // padding from right edge
      setModalPosition({ x: screenWidth - modalWidth - rightOffset, y: 20 })
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

  // Modal dragging handlers
  const handleModalMouseDown = (e) => {
    // Only allow dragging from header
    if (e.target.closest('.modal-drag-handle')) {
      setIsModalDragging(true)
      setModalDragStart({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y
      })
    }
  }

  const handleModalMouseMove = (e) => {
    if (isModalDragging) {
      e.preventDefault()
      const newX = e.clientX - modalDragStart.x
      const newY = e.clientY - modalDragStart.y

      // Keep modal within viewport bounds
      const modalWidth = modalRef.current?.offsetWidth || 600
      const modalHeight = modalRef.current?.offsetHeight || 500
      const maxX = window.innerWidth - modalWidth
      const maxY = window.innerHeight - modalHeight

      setModalPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
  }

  const handleModalMouseUp = () => {
    setIsModalDragging(false)
  }

  useEffect(() => {
    if (isModalDragging) {
      document.addEventListener('mousemove', handleModalMouseMove)
      document.addEventListener('mouseup', handleModalMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleModalMouseMove)
        document.removeEventListener('mouseup', handleModalMouseUp)
      }
    }
  }, [isModalDragging, modalDragStart, modalPosition])

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
      className="fixed inset-0 bg-black bg-opacity-30 z-[60]"
      onClick={handleBackdropClick}
    >
      {/* Modal Container - Compact and Draggable */}
      <div
        ref={modalRef}
        className="absolute bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col overflow-hidden"
        style={{
          left: `${modalPosition.x}px`,
          top: `${modalPosition.y}px`,
          cursor: isModalDragging ? 'grabbing' : 'default'
        }}
        onMouseDown={handleModalMouseDown}
      >
        {/* Header - Draggable */}
        <div className="modal-drag-handle bg-gradient-to-r from-blue-600 to-indigo-600 p-3 flex items-center justify-between cursor-move select-none">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Drag indicator */}
            <div className="text-white opacity-70">
              <Move className="w-4 h-4" />
            </div>

            {/* Document counter */}
            {documents.length > 1 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded px-2 py-1 text-white font-medium text-xs">
                {currentIndex + 1} / {documents.length}
              </div>
            )}

            {/* Document name */}
            {currentDoc.name && (
              <div className="text-white font-medium truncate text-sm">
                {currentDoc.name}
              </div>
            )}
          </div>

          {/* Controls - Compact */}
          <div className="flex items-center space-x-1 ml-3">
            {!isPDF && (
              <>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded px-2 py-1 text-white font-medium text-xs min-w-[45px] text-center">
                  {Math.round(zoom * 100)}%
                </div>

                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRotate}
                  className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-white"
                  aria-label="Rotate"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={handleDownload}
              className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-white"
              aria-label="Download"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-white"
              aria-label="Close"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document viewer - Compact */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center min-h-[400px]">
          {/* Navigation buttons - Smaller */}
          {documents.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white hover:bg-gray-100 rounded shadow-lg transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label="Previous document"
                title="Previous (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === documents.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white hover:bg-gray-100 rounded shadow-lg transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label="Next document"
                title="Next (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Content */}
          <div
            className="w-full h-full flex items-center justify-center p-4 overflow-auto"
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

          {/* Zoom hint - Compact */}
          {!isPDF && zoom <= 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1.5 rounded">
              Use zoom to enlarge
            </div>
          )}
        </div>

        {/* Footer - Compact */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              {!isPDF && (
                <span>💡 Zoom & drag to move</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">ESC</kbd> close</span>
              {documents.length > 1 && (
                <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">→</kbd></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentLightbox
