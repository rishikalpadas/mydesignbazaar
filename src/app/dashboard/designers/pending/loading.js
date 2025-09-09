export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
          <div className="h-5 bg-white/10 rounded w-96"></div>
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-40 h-10 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-20 h-9 bg-gray-300 rounded-lg"></div>
                    <div className="w-20 h-9 bg-gray-300 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
