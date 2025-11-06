"use client"
import { useState, useEffect, useCallback } from "react"
import { Heart, ShoppingCart, ArrowLeft, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const WishlistPage = () => {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const [addingToCart, setAddingToCart] = useState(null)
  const [error, setError] = useState(null)

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/wishlist", {
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/")
          return
        }
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()
      if (data.success) {
        setWishlistItems(data.wishlist.items || [])
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      setError("Failed to load wishlist. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const removeFromWishlist = async (designId) => {
    try {
      setRemoving(designId)
      const response = await fetch(`/api/wishlist?designId=${designId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item")
      }

      const data = await response.json()
      if (data.success) {
        setWishlistItems(data.wishlist.items || [])
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      alert("Failed to remove item. Please try again.")
    } finally {
      setRemoving(null)
    }
  }

  const addToCart = async (designId) => {
    try {
      setAddingToCart(designId)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ designId }),
      })

      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }

      const data = await response.json()
      if (data.success) {
        alert("Design added to cart successfully!")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add to cart. Please try again.")
    } finally {
      setAddingToCart(null)
    }
  }

  const getDesignerName = (item) => {
    if (!item?.designId?.uploadedBy) return "Unknown Designer"

    const designer = item.designId.uploadedBy.userId
    if (designer?.displayName) return designer.displayName
    if (designer?.fullName) return designer.fullName
    return item.designId.uploadedBy.email?.split("@")[0] || "Unknown Designer"
  }

  const getPreviewImage = (design) => {
    if (design?.previewImages && design.previewImages.length > 0) {
      const primary = design.previewImages.find(img => img.isPrimary) || design.previewImages[0]
      return `/api/uploads/designs/${design.designId}/preview/${primary.filename}`
    }
    if (design?.previewImage?.filename) {
      return `/api/uploads/designs/${design.designId}/preview/${design.previewImage.filename}`
    }
    return "/placeholder.svg"
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-amber-500 transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'design' : 'designs'} you love
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Save designs you love to view them later</p>
              <button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer"
              >
                Explore Designs
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                const design = item.designId
                if (!design) return null

                return (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                    <div className="relative h-48 group">
                      <Image
                        src={getPreviewImage(design)}
                        alt={design.title || "Design"}
                        fill
                        className="object-cover rounded-t-xl cursor-pointer"
                        onClick={() => router.push(`/product/details/${design._id}`)}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                      {design.featured && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                      <button
                        onClick={() => removeFromWishlist(design._id)}
                        disabled={removing === design._id}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Remove from wishlist"
                      >
                        {removing === design._id ? (
                          <Loader2 size={16} className="animate-spin text-red-500" />
                        ) : (
                          <Heart size={16} className="text-red-500 fill-current group-hover/btn:text-red-600" />
                        )}
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-amber-600 font-medium">
                          {design.category}
                        </span>
                      </div>
                      <h3
                        className="font-semibold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-amber-600"
                        onClick={() => router.push(`/product/details/${design._id}`)}
                      >
                        {design.title || "Untitled Design"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 truncate">
                        by {getDesignerName(item)}
                      </p>

                      {design.tags && design.tags.length > 0 && (
                        <div className="flex gap-1 mb-3 flex-wrap">
                          {design.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(design._id)}
                          disabled={addingToCart === design._id}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {addingToCart === design._id ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} />
                              Add to Cart
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => removeFromWishlist(design._id)}
                          disabled={removing === design._id}
                          className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          aria-label="Remove from wishlist"
                        >
                          {removing === design._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default WishlistPage
