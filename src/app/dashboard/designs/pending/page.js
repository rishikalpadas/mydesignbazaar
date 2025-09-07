"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import DashboardPageWrapper from '@/components/dashboard/DashboardPageWrapper'

const PendingDesignsContent = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [rejecting, setRejecting] = useState({}) // map of id->bool

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/designs/pending", { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setItems(data.designs || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approveDesign = async (designId) => {
    const res = await fetch("/api/admin/designs/approve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ designId }),
    })
    if (res.ok) setItems((list) => list.filter((i) => i.id !== designId))
  }

  const rejectDesign = async (designId, reason) => {
    setRejecting((r) => ({ ...r, [designId]: true }))
    const res = await fetch("/api/admin/designs/reject", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ designId, reason }),
    })
    setRejecting((r) => ({ ...r, [designId]: false }))
    if (res.ok) setItems((list) => list.filter((i) => i.id !== designId))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pending Designs</h1>
        <p className="text-gray-600">Review and approve design submissions</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        {!loading && items.length === 0 && <p className="text-gray-600">No pending designs.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {items.map((d) => (
          <li key={d.id} className="rounded-lg border p-4 space-y-3">
            {d.previewImageUrl ? (
              <Image
                src={d.previewImageUrl || "/placeholder.svg"}
                alt={d.title}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded-md border"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-md grid place-items-center text-gray-500">No preview</div>
            )}
            <div>
              <p className="font-medium">{d.title}</p>
              <p className="text-sm text-gray-500">
                {d.category} • {d.uploadedBy?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => approveDesign(d.id)}
                className="rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  const reason = window.prompt("Rejection reason?")
                  if (reason) rejectDesign(d.id, reason)
                }}
                disabled={!!rejecting[d.id]}
                className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {rejecting[d.id] ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </li>
        ))}
        </div>
      </div>
    </div>
  )
}

const PendingDesignsPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <PendingDesignsContent />
    </DashboardPageWrapper>
  )
}

export default PendingDesignsPage
