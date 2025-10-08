/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
