"use client"
import { useState } from "react"
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const WishlistPage = () => {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Elegant Floral Mandala",
      designer: "Kavya Reddy",
      price: 399,
      originalPrice: 499,
      image: "/elegant-floral-mandala.png",
      category: "Traditional",
      isOnSale: true,
    },
    {
      id: 2,
      name: "Contemporary Abstract Art",
      designer: "Rohit Kumar",
      price: 299,
      image: "/contemporary-abstract-design.png",
      category: "Modern",
      isOnSale: false,
    },
    {
      id: 3,
      name: "Vintage Typography Design",
      designer: "Meera Singh",
      price: 199,
      originalPrice: 249,
      image: "/vintage-typography.png",
      category: "Typography",
      isOnSale: true,
    },
  ])

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  const addToCart = (item) => {
    // Add to cart logic here
    console.log("Added to cart:", item)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-amber-500 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">{wishlistItems.length} designs you love</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save designs you love to view them later</p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Explore Designs
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  {item.isOnSale && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Sale
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group"
                  >
                    <Heart size={16} className="text-red-500 fill-current group-hover:text-red-600" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-amber-600 font-medium">{item.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">by {item.designer}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
