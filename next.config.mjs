/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for VPS deployment - disable static optimization
  // This prevents build errors with client-side authentication
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Skip trailing slash redirect (moved from experimental in Next.js 16)
  skipTrailingSlashRedirect: true,
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverActions: true,
  },
   api: {
    bodyParser: {
      sizeLimit: '500mb', // Increased to handle multiple large files
    },
    responseLimit: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    largePageDataBytes: 128 * 100000, // Increased for large form submissions
  },
  // Disable static page generation for dashboard routes
  async headers() {
    return [
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  images: {
    // Allow images from any domain for production flexibility
    remotePatterns: [
      // Local development - localhost
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Local development - allow all local network IP addresses
      {
        protocol: 'http',
        hostname: '**.168.**',
      },
      {
        protocol: 'http',
        hostname: '10.**',
      },
      {
        protocol: 'http',
        hostname: '172.**',
      },
      // Production domain - allow all domains
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Disable image optimization for static uploads in production
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Static file serving is handled by API route at /api/uploads/[...path]
  // Turbopack config to ignore upload directories during build
  turbopack: {},

  // Webpack config for production builds (ignore uploads directory)
  webpack: (config, { isServer }) => {
    // Ignore uploads directory to prevent build performance issues
    if (!isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/public/uploads/**'],
      }
    }
    return config
  },
};

export default nextConfig;
