/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    const goBackendUrl = process.env.GO_BACKEND_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/health',
        destination: `${goBackendUrl}/api/health`,
      },
      {
        source: '/api/colleges',
        destination: `${goBackendUrl}/api/colleges`,
      },
    ];
  },
};

export default nextConfig;
