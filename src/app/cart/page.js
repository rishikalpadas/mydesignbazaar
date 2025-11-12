"use client"
import { useState, useEffect, useCallback } from "react"
import { Trash2, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const CartPage = () => {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const [error, setError] = useState(null)

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart/items", {
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/")
          return
        }
        throw new Error("Failed to fetch cart")
      }

      const data = await response.json()
      if (data.success) {
        setCartItems(data.cart.items || [])
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setError("Failed to load cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const removeItem = async (designId) => {
    try {
      setRemoving(designId)
      const response = await fetch(`/api/cart/items?designId=${designId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item")
      }

      const data = await response.json()
      if (data.success) {
        setCartItems(data.cart.items || [])
        // Reload page after removing item
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (error) {
      console.error("Error removing item:", error)
      alert("Failed to remove item. Please try again.")
    } finally {
      setRemoving(null)
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

  const handleCheckout = () => {
    // Navigate to pricing or checkout page
    router.push("/pricing")
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your cart...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
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

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
              <button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  </div>
                  <div className="divide-y">
                    {cartItems.map((item) => {
                      const design = item.designId
                      if (!design) return null

                      return (
                        <div key={item._id} className="p-6 flex gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={getPreviewImage(design)}
                              alt={design.title || "Design"}
                              fill
                              className="rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg"
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {design.title || "Untitled Design"}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              by {getDesignerName(item)}
                            </p>
                            <p className="text-xs text-amber-600 font-medium mt-1">
                              {design.category}
                            </p>
                            {design.tags && design.tags.length > 0 && (
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {design.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end justify-between">
                            <button
                              onClick={() => removeItem(design._id)}
                              disabled={removing === design._id}
                              className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Remove from cart"
                            >
                              {removing === design._id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => router.push(`/product/details/${design._id}`)}
                              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Designs</span>
                      <span className="font-medium">{cartItems.length}</span>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-500 mb-2">
                        Subscribe to a plan to download these designs
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all mb-3 cursor-pointer"
                  >
                    View Subscription Plans
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
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

export default CartPage
