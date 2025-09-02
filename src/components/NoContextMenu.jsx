"use client"
import { useEffect } from "react"

export default function NoContextMenu() {
  useEffect(() => {
    const handler = (e) => e.preventDefault()
    document.addEventListener("contextmenu", handler, { passive: false })
    return () => document.removeEventListener("contextmenu", handler)
  }, [])
  return null
}
