import connectDB from "../../../lib/mongodb"
import Design from "../../../models/Design"
import Link from "next/link"
import CategoryFilters from "../../../components/category/CategoryFilters.jsx"
import DesignGrid from "../../../components/category/DesignGrid"
import { getCategoryFromSlug } from "../../../lib/category-map"
import { serializeObjectIds } from "../../../lib/serializeObjectIds"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"


const PER_PAGE_DEFAULT = 12

export default async function CategoryPage({ params, searchParams }) {
    const { slug } = await params
  const resolvedSearchParams = await searchParams
  const category = getCategoryFromSlug(slug);


  if (!category) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Unknown category</h1>
          <p className="text-gray-600 mt-2">The category “{slug}” is not supported.</p>
          <div className="mt-6">
            <Link
              href="/#categories"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full font-semibold shadow hover:from-blue-700 hover:to-purple-700"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </main>
    )
  }

  await connectDB()

  // Build query from searchParams
  const page = Math.max(Number.parseInt(resolvedSearchParams?.page ?? "1", 10) || 1, 1)
  const perPage = Math.min(
    Math.max(Number.parseInt(resolvedSearchParams?.limit ?? PER_PAGE_DEFAULT, 10) || PER_PAGE_DEFAULT, 1),
    48,
  )
  const q = (resolvedSearchParams?.q ?? "").trim()
  const sortKey = resolvedSearchParams?.sort ?? "newest"

  const query = {
    status: "approved",
    category,
    ...(q ? { title: { $regex: q, $options: "i" } } : {}),
  }

  const sort = getSort(sortKey)
  const skip = (page - 1) * perPage

  const [designs, total] = await Promise.all([
    Design.find(query).sort(sort).skip(skip).limit(perPage).lean(),
    Design.countDocuments(query),
  ])

  // Add image URLs explicitly and convert ObjectId to string
  const items = designs.map(design => {
    const designIdToUse = design.designId || design._id
    const designIdString = String(designIdToUse)
    const designIdMongoDB = String(design._id)

    // Handle multiple preview images
    if (design.previewImages && design.previewImages.length > 0) {
      design.previewImageUrls = design.previewImages.map(img => ({
        ...img,
        url: `/api/uploads/designs/${designIdString}/preview/${img.filename}`
      }))
      const primary = design.previewImages.find(img => img.isPrimary) || design.previewImages[0]
      design.previewImageUrl = `/api/uploads/designs/${designIdString}/preview/${primary.filename}`
    } else if (design.previewImage) {
      design.previewImageUrl = `/api/uploads/designs/${designIdString}/preview/${design.previewImage.filename}`
      design.previewImageUrls = [{
        ...design.previewImage,
        url: `/api/uploads/designs/${designIdString}/preview/${design.previewImage.filename}`,
        isPrimary: true
      }]
    }

    // Convert MongoDB ObjectId fields to strings for client component compatibility
    const serialized = serializeObjectIds({
      ...design,
      _id: designIdMongoDB,
      designId: designIdString
    })
    
    return serialized
  })

  const totalPages = Math.max(Math.ceil(total / perPage), 1)


  const handleAuthClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  return (
    <>
    <Navbar/>
    <main className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero / Breadcrumb */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#categories" className="hover:text-gray-700">
                  Categories
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-gray-900 font-medium">
                {category}
              </li>
            </ol>
          </nav>

          {/* Title + Stats */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Category
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Explore {category} Designs
              </h1>
              <p className="text-gray-600 mt-2">Only admin-approved designs are listed here.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-100">
                {total} {total === 1 ? "Design" : "Designs"}
              </span>
              {q ? (
                <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm border border-purple-100">
                  Search: “{q}”
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryFilters defaultQuery={{ q, sort: sortKey, page }} total={total} />
      </section>

      {/* Listing Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {items.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 1.343-3 3v7h6v-7c0-1.657-1.343-3-3-3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 21h14M8 11h8" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No designs found</h2>
            <p className="text-gray-600 mt-2">
              Try a different search or check back later as new designs get approved.
            </p>
            <div className="mt-6">
              <Link
                href="/#categories"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full font-semibold shadow hover:from-blue-700 hover:to-purple-700"
              >
                Browse All Categories
              </Link>
            </div>
          </div>
        ) : (
          <DesignGrid items={items} categoryLabel={category} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 ? (
              <Link
                href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams || {})), page: String(page - 1) }).toString()}`}
                className="px-4 py-2 border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Previous
              </Link>
            ) : (
              <span className="px-4 py-2 border border-gray-200 text-gray-400 rounded-xl">Previous</span>
            )}

            <span className="text-sm text-gray-600 px-3 py-2">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams || {})), page: String(page + 1) }).toString()}`}
                className="px-4 py-2 border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Next
              </Link>
            ) : (
              <span className="px-4 py-2 border border-gray-200 text-gray-400 rounded-xl">Next</span>
            )}
          </div>
        )}
      </section>
    </main>
    <Footer/>
    </>
  )
}

// Helper: sort mapping consistent with available fields
function getSort(sortKey) {
  switch ((sortKey || "newest").toLowerCase()) {
    case "oldest":
      return { createdAt: 1 }
    case "downloads":
      return { downloads: -1, createdAt: -1 }
    case "views":
      return { views: -1, createdAt: -1 }
    case "title":
      return { title: 1 }
    case "newest":
    default:
      return { createdAt: -1 }
  }
}
