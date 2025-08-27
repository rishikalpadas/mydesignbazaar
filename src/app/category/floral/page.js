import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal, 
  Heart,
  Download,
  Eye,
  Star,
  ChevronDown,
  X,
  Palette,
  User,
  Calendar,
  ArrowUpDown
} from 'lucide-react'
import Image from 'next/image'

// Mock data matching your database structure
const mockDesigns = [
  {
    _id: '1',
    title: 'Elegant Floral Mandala',
    description: 'Beautiful traditional mandala with intricate floral patterns',
    category: 'Floral',
    tags: ['mandala', 'floral', 'traditional', 'decorative'],
    previewImageUrl: '/elegant-floral-mandala.png',
    uploadedBy: { name: 'Priya Sharma', _id: 'user1' },
    views: 1240,
    downloads: 89,
    featured: true,
    uploadDate: '2024-01-15',
    status: 'approved',
    rating: 4.8
  },
  {
    _id: '2',
    title: 'Modern Geometric Pattern',
    description: 'Contemporary geometric design with bold colors',
    category: 'AI-Generated',
    tags: ['geometric', 'modern', 'abstract', 'colorful'],
    previewImageUrl: '/modern-geometric-pattern.png',
    uploadedBy: { name: 'Rahul Design', _id: 'user2' },
    views: 890,
    downloads: 67,
    featured: false,
    uploadDate: '2024-01-20',
    status: 'approved',
    rating: 4.6
  },
  {
    _id: '3',
    title: 'Vintage Typography Art',
    description: 'Classic vintage-style typography with ornamental elements',
    category: 'Typography',
    tags: ['vintage', 'typography', 'classic', 'ornamental'],
    previewImageUrl: '/vintage-typography.png',
    uploadedBy: { name: 'Creative Studio', _id: 'user3' },
    views: 2100,
    downloads: 145,
    featured: true,
    uploadDate: '2024-01-10',
    status: 'approved',
    rating: 4.9
  },
  {
    _id: '4',
    title: 'Kids Cartoon Character',
    description: 'Cute cartoon character design perfect for children apparel',
    category: 'Kidswear',
    tags: ['cartoon', 'kids', 'cute', 'colorful'],
    previewImageUrl: '/contemporary-abstract-design.png',
    uploadedBy: { name: 'Kids Designer', _id: 'user4' },
    views: 567,
    downloads: 34,
    featured: false,
    uploadDate: '2024-01-25',
    status: 'approved',
    rating: 4.5
  },
  {
    _id: '5',
    title: 'Abstract Contemporary Art',
    description: 'Modern abstract design with flowing patterns',
    category: 'Womenswear',
    tags: ['abstract', 'contemporary', 'flowing', 'artistic'],
    previewImageUrl: '/contemporary-abstract-design.png',
    uploadedBy: { name: 'Art Studio', _id: 'user5' },
    views: 1456,
    downloads: 92,
    featured: false,
    uploadDate: '2024-01-18',
    status: 'approved',
    rating: 4.7
  },
  {
    _id: '6',
    title: 'Traditional Paisley Pattern',
    description: 'Classic Indian paisley design with traditional motifs',
    category: 'Menswear',
    tags: ['paisley', 'traditional', 'indian', 'classic'],
    previewImageUrl: '/traditional-paisley.png',
    uploadedBy: { name: 'Heritage Designs', _id: 'user6' },
    views: 987,
    downloads: 76,
    featured: true,
    uploadDate: '2024-01-12',
    status: 'approved',
    rating: 4.8
  }
]

const CATEGORIES = [
  'All Categories',
  'Infantwear',
  'Kidswear', 
  'Menswear',
  'Womenswear',
  'Typography',
  'Floral',
  'AI-Generated'
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'downloads', label: 'Most Downloaded' }
]

const CategoryListingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [designs, setDesigns] = useState(mockDesigns)
  const [filteredDesigns, setFilteredDesigns] = useState(mockDesigns)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wishlistedItems, setWishlistedItems] = useState(new Set())
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedTags, setSelectedTags] = useState([])
  const [minRating, setMinRating] = useState(0)

  // Get unique tags from all designs
  const allTags = [...new Set(designs.flatMap(design => design.tags))]

  useEffect(() => {
    filterAndSortDesigns()
  }, [selectedCategory, searchQuery, sortBy, selectedTags, minRating])

  const filterAndSortDesigns = () => {
    let filtered = designs

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(design => design.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(design => 
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(design => 
        selectedTags.every(tag => design.tags.includes(tag))
      )
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(design => design.rating >= minRating)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadDate) - new Date(a.uploadDate)
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate)
        case 'popular':
          return b.views - a.views
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        default:
          return 0
      }
    })

    setFilteredDesigns(filtered)
  }

  const toggleWishlist = (designId) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(designId)) {
        newSet.delete(designId)
      } else {
        newSet.add(designId)
      }
      return newSet
    })
  }

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setSelectedTags([])
    setMinRating(0)
    setPriceRange([0, 1000])
    setSearchQuery('')
  }

  const DesignCard = ({ design, isListView = false }) => (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isListView ? 'flex' : ''}`}>
      <div className={`relative ${isListView ? 'w-48 h-32' : 'aspect-square'} overflow-hidden`}>
        <Image
          src={design.previewImageUrl}
          alt={design.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button 
            onClick={() => toggleWishlist(design._id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              wishlistedItems.has(design._id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlistedItems.has(design._id) ? 'fill-current' : ''}`} />
          </button>
          {design.featured && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium ml-1">{design.rating}</span>
          </div>
        </div>
      </div>
      
      <div className={`p-4 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {design.title}
          </h3>
          <span className="text-sm text-gray-500 bg-orange-50 px-2 py-1 rounded-full ml-2">
            {design.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {design.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {design.uploadedBy.name}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(design.uploadDate).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {design.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {design.tags.length > 3 && (
            <span className="text-gray-500 text-xs">+{design.tags.length - 3} more</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {design.views.toLocaleString()}
            </div>
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              {design.downloads}
            </div>
          </div>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {selectedCategory === 'All Categories' ? 'All Designs' : selectedCategory}
            </h1>
            <p className="text-purple-100 text-lg">
              Discover amazing designs from talented creators
            </p>
            <div className="flex justify-center mt-2">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                {filteredDesigns.length} designs found
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-purple-600" />
                  Filters
                </h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search designs..."
                    className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="space-y-1">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                          : 'hover:bg-orange-50 text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0, 0].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                        minRating === rating
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                          : 'hover:bg-orange-50 text-gray-700'
                      }`}
                    >
                      {rating > 0 ? (
                        <>
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          {rating}+ Stars
                        </>
                      ) : (
                        'All Ratings'
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 font-medium">
                    {filteredDesigns.length} designs
                  </span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow-sm text-purple-600' 
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-sm text-purple-600' 
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-orange-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden bg-purple-500 text-white px-4 py-2 rounded-xl flex items-center"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTags.length > 0 || minRating > 0 || searchQuery) && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Active Filters:</h3>
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                      Search: "{searchQuery}"
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="ml-2 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedTags.map(tag => (
                    <div key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button 
                        onClick={() => handleTagToggle(tag)}
                        className="ml-2 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {minRating > 0 && (
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                      {minRating}+ Stars
                      <button 
                        onClick={() => setMinRating(0)}
                        className="ml-2 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Designs Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredDesigns.length === 0 ? (
              <div className="text-center py-16">
                <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }`}>
                {filteredDesigns.map(design => (
                  <DesignCard 
                    key={design._id} 
                    design={design} 
                    isListView={viewMode === 'list'} 
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredDesigns.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg">
                  Load More Designs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryListingPage