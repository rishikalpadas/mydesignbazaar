// Also includes robust preview URL fallback.
"use client"
import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import ImageLightbox from "../../components/ImageLightbox"
import { useRouter } from "next/navigation"

function getPreviewUrl(d) {
  // Try new multiple preview images first
  if (d?.previewImageUrls && d.previewImageUrls.length > 0) {
    const primary = d.previewImageUrls.find(img => img.isPrimary) || d.previewImageUrls[0]
    return primary.url
  }
  
  // Fallback to single preview image URL
  if (d?.previewImageUrl) return d.previewImageUrl
  
  // Fallback to old structure
  const filename = d?.previewImage?.filename
  if (filename && d?._id) return `/api/uploads/designs/${d._id}/preview/${filename}`
  
  return "/design-preview.svg"
}

function getAllPreviewUrls(d) {
  // Return all preview image URLs for gallery view
  if (d?.previewImageUrls && d.previewImageUrls.length > 0) {
    return d.previewImageUrls.map(img => img.url)
  }
  
  // Fallback to single image
  const singleUrl = getPreviewUrl(d)
  return singleUrl !== "/design-preview.svg" ? [singleUrl] : []
}

// Individual Design Card with Slideshow
function DesignCard({ d, categoryLabel, onImageClick, router }) {
  const allUrls = getAllPreviewUrls(d)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isHovered && allUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allUrls.length)
      }, 1500) // Change image every 1.5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setCurrentImageIndex(0)
    }
  }, [isHovered, allUrls.length])

  const currentUrl = allUrls.length > 0 ? allUrls[currentImageIndex] : getPreviewUrl(d)

  return (
    <article
      className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden"
      onClick={() => router.push(`/product/details/${d._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Slideshow */}
      <div className="relative overflow-hidden block w-full h-48 sm:h-52 md:h-56">
        {allUrls.map((url, index) => (
          <img
            key={index}
            src={url || "/placeholder.svg"}
            alt={`${d.title || "Design preview"} - Image ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              index === currentImageIndex
                ? "opacity-100 scale-100 group-hover:scale-110"
                : "opacity-0 scale-95"
            }`}
            draggable={false}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/design-preview.svg"
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        {/* <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          {categoryLabel}
        </div> */}

        {/* Multiple Images Indicator with Dots */}
        {allUrls.length > 1 && (
          <>
            {/* <div className="absolute top-2 left-2 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              {allUrls.length}
            </div> */}

            {/* Pagination Dots */}
            {isHovered && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {allUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-2">
        <h3 className="text-base font-bold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-1">
          {d.title || "Untitled Design"}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{d.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {d.views ?? 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m4-4H8" />
              </svg>
              {d.downloads ?? 0}
            </span>
          </div>
          {/* <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-amber-700 rounded-full font-medium">
            Approved
          </span> */}
        </div>

        <div className="pt-2">
          <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-600 to-amber-600 transition-all duration-700 rounded-full"></div>
        </div>
      </div>
    </article>
  )
}

export default function DesignGrid({ items = [], categoryLabel = "" }) {
  const [lightboxData, setLightboxData] = useState(null);
  const router = useRouter();

  const handleOpen = useCallback((url, allUrls = []) => {
    setLightboxData({
      src: url,
      srcs: allUrls.length > 1 ? allUrls : [url]
    })
  }, [])

  const handleClose = useCallback(() => setLightboxData(null), [])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {items.map((d) => (
          <DesignCard
            key={String(d._id)}
            d={d}
            categoryLabel={categoryLabel}
            onImageClick={handleOpen}
            router={router}
          />
        ))}
      </div>

      {/* {lightboxData ? (
        <ImageLightbox
          src={lightboxData.src}
          srcs={lightboxData.srcs}
          onClose={handleClose}
        />
      ) : null} */}
    </>
  )
}
