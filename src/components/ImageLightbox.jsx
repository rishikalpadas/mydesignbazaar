// Uses repeated SVG background for watermark; placed ABOVE the image with z-index.
"use client"
import { useMemo, useEffect } from "react"

export default function ImageLightbox({ src, alt = "Preview", onClose }) {
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

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose?.()
    window.addEventListener("keydown", esc)
    return () => window.removeEventListener("keydown", esc)
  }, [onClose])

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
          src={src || "/placeholder.svg?height=800&width=1200&query=design%20preview"}
          alt={alt}
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

        {/* Controls */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/90 hover:bg-white text-gray-900 px-3 py-1.5 text-sm shadow"
        >
          Close
        </button>
      </div>
    </div>
  )
}
