/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/adminstyven24',
        destination: '/admin',
      },
      {
        source: '/adminstyven24/:path*',
        destination: '/admin/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  }
}

module.exports = nextConfig
