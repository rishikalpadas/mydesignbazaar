"use client"
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Eye, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SimilarDesignsSlider = ({ currentDesignId }) => {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSimilarDesigns = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/designs/similar/${currentDesignId}`)
        const data = await response.json()

        if (data.success) {
          setDesigns(data.designs)
        }
      } catch (error) {
        console.error('Error fetching similar designs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentDesignId) {
      fetchSimilarDesigns()
    }
  }, [currentDesignId])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 300
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
    setScrollPosition(newPosition)
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft)
    }
  }

  const handleDesignClick = (designId) => {
    router.push(`/product/details/${designId}`)
  }

  if (loading) {
    return (
      <div className="w-full py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!designs || designs.length === 0) {
    return null
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = scrollContainerRef.current &&
    scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth

  return (
    <div className="w-full py-12 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Similar Designs
            </h2>
            <p className="text-gray-600">
              Explore more designs you might like
            </p>
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all ${
                canScrollLeft
                  ? 'bg-white hover:bg-gray-100 text-gray-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all ${
                canScrollRight
                  ? 'bg-white hover:bg-gray-100 text-gray-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {designs.map((design) => (
              <div
                key={design._id}
                className="flex-none w-48 md:w-56 group cursor-pointer"
                onClick={() => handleDesignClick(design._id)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {design.previewImageUrl ? (
                      <Image
                        src={design.previewImageUrl}
                        alt={design.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder.svg'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          <span>{design.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      {design.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">
                      {design.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {design.description}
                    </p>

                    {/* Tags */}
                    {design.tags && design.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {design.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {design.tags.length > 2 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            +{design.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Mobile: Scroll indicator */}
        <div className="md:hidden flex justify-center gap-1 mt-4">
          {Array.from({ length: Math.ceil(designs.length / 2) }).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                Math.floor(scrollPosition / 200) === index
                  ? 'w-8 bg-orange-500'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SimilarDesignsSlider
