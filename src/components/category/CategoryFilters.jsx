"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, SortAsc } from "lucide-react"

export default function CategoryFilters({ defaultQuery = { q: "", sort: "newest", page: 1 }, total = 0 }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [q, setQ] = useState(searchParams.get("q") ?? defaultQuery.q)
  const [sort, setSort] = useState(searchParams.get("sort") ?? defaultQuery.sort)

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) params.set("q", q)
      else params.delete("q")
      params.set("page", "1") // reset page on new query
      params.set("sort", sort || "newest")
      router.push(`${pathname}?${params.toString()}`)
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort])

  const onSortChange = (e) => {
    setSort(e.target.value)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        {/* Search */}
        <div className="w-full md:max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search designs in this category..."
              className="w-full pl-10 pr-4 py-2.5 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
              aria-label="Search designs"
            />
          </div>
        </div>

        {/* Right side: Sort + Count */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={sort}
              onChange={onSortChange}
              className="px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-sm"
              aria-label="Sort designs"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="downloads">Most Downloaded</option>
              <option value="views">Most Viewed</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {total} {total === 1 ? "design" : "designs"}
          </div>
        </div>
      </div>
    </div>
  )
}
