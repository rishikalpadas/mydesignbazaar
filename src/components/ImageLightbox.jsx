// Uses repeated SVG background for watermark; placed ABOVE the image with z-index.
// Supports both single image and gallery mode
"use client"
import { useMemo, useEffect, useState } from "react"

export default function ImageLightbox({ 
  src, 
  srcs = [], // Array of image URLs for gallery mode
  alt = "Preview", 
  onClose 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Determine if we're in gallery mode
  const isGallery = srcs && srcs.length > 1
  const images = isGallery ? srcs : [src].filter(Boolean)
  const currentSrc = images[currentIndex] || src
  const istStamp = useMemo(() => {
    try {
      return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    } catch {
      return new Date().toLocaleString("en-IN")
    }
  }, [])

  const watermarkUrl = useMemo(() => {
    const text = `mydesignbazaar — ${istStamp}`
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='280' height='180'>
        <style>
          text {
            font: 600 16px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            fill: rgba(255,255,255,0.22);
            stroke: rgba(0,0,0,0.18);
            stroke-width: 1;
            paint-order: stroke;
          }
        </style>
        <g transform='rotate(-30 140 90)'>
          <text x='20' y='40'>${text}</text>
          <text x='20' y='100'>${text}</text>
          <text x='20' y='160'>${text}</text>
        </g>
      </svg>
    `.trim()
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
  }, [istStamp])

  const goToPrevious = () => {
    if (!isGallery) return
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
  }

  const goToNext = () => {
    if (!isGallery) return
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
  }

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        onClose?.()
      } else if (isGallery) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          goToPrevious()
        } else if (e.key === "ArrowRight") {
          e.preventDefault()
          goToNext()
        }
      }
    }
    
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [onClose, isGallery, images.length])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="relative max-w-6xl w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={currentSrc || "/placeholder.svg?height=800&width=1200&query=design%20preview"}
          alt={`${alt} ${isGallery ? `(${currentIndex + 1}/${images.length})` : ''}`}
          className="absolute inset-0 h-full w-full object-contain select-none"
          draggable={false}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: watermarkUrl,
            backgroundRepeat: "repeat",
            backgroundSize: "280px 180px",
            // Helps remain visible on both light/dark image regions
            mixBlendMode: "multiply",
            opacity: 1,
          }}
        />

        {/* Gallery Navigation */}
        {isGallery && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 hover:bg-white text-gray-900 p-2 shadow-lg transition-all"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 hover:bg-white text-gray-900 p-2 shadow-lg transition-all"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white/90 text-gray-900 px-3 py-1.5 rounded-full text-sm shadow">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            {images.length <= 10 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex space-x-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                {images.map((imgSrc, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/90 hover:bg-white text-gray-900 px-3 py-1.5 text-sm shadow-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  )
}
