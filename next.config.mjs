/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for VPS deployment - disable static optimization
  // This prevents build errors with client-side authentication
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Experimental features
  experimental: {
    skipTrailingSlashRedirect: true,
    optimizePackageImports: ['lucide-react'],
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
  // Empty turbopack config to allow build to proceed
  turbopack: {},
};

export default nextConfig;
