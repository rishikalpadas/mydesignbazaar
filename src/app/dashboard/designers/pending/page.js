"use client"
import { useEffect, useState } from "react"

export default function PendingDesignersPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/designers/pending", { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setItems(data.designers || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approveDesigner = async (userId) => {
    const res = await fetch("/api/admin/designers/approve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, approve: true }),
    })
    if (res.ok) setItems((list) => list.filter((i) => i.id !== userId))
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Pending Designers</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && items.length === 0 && <p>No pending designers.</p>}
      <ul className="space-y-3">
        {items.map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">{d.profile?.displayName || d.profile?.fullName || d.email}</p>
              <p className="text-sm text-gray-500">{d.email}</p>
            </div>
            <button
              onClick={() => approveDesigner(d.id)}
              className="rounded-md bg-orange-600 px-3 py-2 text-white hover:bg-orange-700"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
