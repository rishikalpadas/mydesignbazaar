/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from any domain for production flexibility
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      // Production domain - adjust hostname as needed
      {
        protocol: 'https',
        hostname: '**', // Allow all domains for production
        pathname: '/uploads/**',
      },
    ],
    // Disable image optimization for static uploads in production
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Static file serving is handled by API route at /api/uploads/[...path]
};

export default nextConfig;
