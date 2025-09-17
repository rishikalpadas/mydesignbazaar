import Link from "next/link"
import { getSlugFromCategory } from "@/lib/category-map"

const categories = [
  {
    title: "Infantwear",
    image: "https://images.pexels.com/photos/4947568/pexels-photo-4947568.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Soft, comfy designs for newborns",
    count: "75+ designs",
  },
  {
    title: "Kidswear",
    image: "https://images.pexels.com/photos/3641072/pexels-photo-3641072.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Playful designs for little ones",
    count: "120+ designs",
  },
  {
    title: "Menswear",
    image: "https://images.pexels.com/photos/6263091/pexels-photo-6263091.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Bold & contemporary styles",
    count: "250+ designs",
  },
  {
    title: "Womenswear",
    image: "https://images.pexels.com/photos/6311394/pexels-photo-6311394.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Elegant & trendy collections",
    count: "300+ designs",
  },
  {
    title: "Festival & Ethnic",
    image: "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Traditional Indian motifs",
    count: "180+ designs",
  },
  {
    title: "Typography",
    image: "https://images.pexels.com/photos/695644/pexels-photo-695644.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Creative text & quotes",
    count: "150+ designs",
  },
  {
    title: "Floral & Nature",
    image: "https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Beautiful botanical patterns",
    count: "200+ designs",
  },
  {
    title: "AI-Generated",
    image: "https://images.pexels.com/photos/16040180/pexels-photo-16040180.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Cutting-edge AI artwork",
    count: "90+ designs",
  },
  {
    title: "Custom Designs",
    image: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Personalized creations",
    count: "50+ designs",
  },
]

const titleToSlug = (title) => {
  if (title === "Floral & Nature") return "floral"
  return getSlugFromCategory(title)
}

const CategoriesSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12 lg:mb-16">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent leading-tight">
            Explore by Category
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Discover unique designs crafted for every style and occasion
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((cat, i) => {
            const slug = titleToSlug(cat.title)
            const Card = (
              <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer border border-gray-100">
                {/* Image Container */}
                <div className="relative overflow-hidden h-40 sm:h-44 md:h-48 lg:h-52">
                  <img
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Design Count Badge */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                    {cat.count}
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed min-h-[2.5rem] flex items-center">
                    {cat.description}
                  </p>
                  <div className="pt-2 sm:pt-3">
                    <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            )

            return (
              <div key={i}>
                {slug ? (
                  <Link href={`/category/${slug}`} aria-label={`View ${cat.title} designs`}>
                    {Card}
                  </Link>
                ) : (
                  Card
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto mt-12 sm:mt-16 lg:mt-20 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border border-blue-100 mx-2 sm:mx-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
            Our talented designers are ready to create custom artwork tailored to your vision
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm sm:text-base cursor-pointer">
            Request Custom Design
          </button>
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
