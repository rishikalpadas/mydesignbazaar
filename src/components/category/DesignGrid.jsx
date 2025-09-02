// Also includes robust preview URL fallback.
"use client"
import { useState, useMemo, useCallback } from "react"
import ImageLightbox from "@/components/ImageLightbox"

function getPreviewUrl(d) {
  if (d?.previewImageUrl) return d.previewImageUrl
  const filename = d?.previewImage?.filename
  if (filename && d?._id) return `/uploads/designs/${d._id}/preview/${filename}`
  return "/design-preview.png"
}

export default function DesignGrid({ items = [], categoryLabel = "" }) {
  const [openSrc, setOpenSrc] = useState(null)

  const handleOpen = useCallback((url) => setOpenSrc(url), [])
  const handleClose = useCallback(() => setOpenSrc(null), [])

  const cards = useMemo(
    () =>
      items.map((d) => {
        const url = getPreviewUrl(d)
        return { key: String(d._id), url, d }
      }),
    [items],
  )

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {cards.map(({ key, url, d }) => (
          <article
            key={key}
            className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden"
          >
            {/* Image */}
            <button
              type="button"
              className="relative overflow-hidden block w-full text-left"
              onClick={() => handleOpen(url)}
            >
              <img
                src={url || "/placeholder.svg"}
                alt={d.title || "Design preview"}
                className="w-full h-48 sm:h-52 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110 select-none"
                draggable={false}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/design-preview.png"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                {categoryLabel}
              </div>
            </button>

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
                <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-amber-700 rounded-full font-medium">
                  Approved
                </span>
              </div>

              <div className="pt-2">
                <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-700 rounded-full"></div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {openSrc ? <ImageLightbox src={openSrc || "/placeholder.svg"} onClose={handleClose} /> : null}
    </>
  )
}
