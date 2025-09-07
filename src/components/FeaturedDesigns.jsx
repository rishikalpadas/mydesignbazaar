import Link from "next/link";

const featuredDesigns = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/6311396/pexels-photo-6311396.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Boho Floral Pattern",
    price: "₹499",
    originalPrice: "₹699",
    designer: "StudioArtiq",
    rating: 4.8,
    downloads: 245,
    category: "Floral",
    isNew: false,
    isTrending: true,
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/5641980/pexels-photo-5641980.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Geometric Festive Motif",
    price: "₹349",
    originalPrice: "₹449",
    designer: "The Pattern Lab",
    rating: 4.9,
    downloads: 189,
    category: "Festival",
    isNew: true,
    isTrending: false,
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/2343467/pexels-photo-2343467.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Typography Quote Pack",
    price: "₹299",
    originalPrice: "₹399",
    designer: "TypoTribe",
    rating: 4.7,
    downloads: 312,
    category: "Typography",
    isNew: false,
    isTrending: true,
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/18129634/pexels-photo-18129634.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Minimal Abstract Set",
    price: "₹599",
    originalPrice: "₹799",
    designer: "Artware Studio",
    rating: 4.6,
    downloads: 156,
    category: "Abstract",
    isNew: true,
    isTrending: false,
  },
];

const FeaturedDesigns = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-0 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
              Hand-picked Collection
            </span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent leading-tight">
            Featured Designs
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Premium designs by top creators, loved by thousands of customers
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Featured Designs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {featuredDesigns.map((design) => (
            <div
              key={design.id}
              className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-3 cursor-pointer border border-gray-100 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badges */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
                  {design.isNew && (
                    <span className="bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-sm">
                      NEW
                    </span>
                  )}
                  {design.isTrending && (
                    <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-sm">
                      🔥 TRENDING
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  {design.category}
                </div>

                {/* Quick Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                {/* Title & Designer */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 line-clamp-1 leading-tight">
                    {design.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    by{" "}
                    <span className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                      {design.designer}
                    </span>
                  </p>
                </div>

                {/* Rating & Downloads */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-gray-700">
                      {design.rating}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {design.downloads} downloads
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-800">
                        {design.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {design.originalPrice}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      Save{" "}
                      {Math.round(
                        ((parseInt(design.originalPrice.slice(1)) -
                          parseInt(design.price.slice(1))) /
                          parseInt(design.originalPrice.slice(1))) *
                          100
                      )}
                      %
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    Buy Now
                  </button>
                </div>

                {/* Progress bar animation */}
                <div className="pt-2">
                  <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <button className="group bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm sm:text-base">
            <Link href="/categories">
            <span className="flex items-center gap-2">
              Explore All Designs
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
