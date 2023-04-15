/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tigerbook-v2.s3.amazonaws.com'],

  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // images: {
  //   // formats: ['image/avif', 'image/webp', 'image/jpg'],
  //   // remotePatterns: [
  //   //   {
  //   //     protocol: 'https',
  //   //     hostname: 'tigerbook-v2.s3.amazonaws.com',
  //   //     port: '',
  //   //     pathname: '/static/**',
  //   //   },
  //   // ],
  //   domains: ['tigerbook-v2.s3.amazonaws.com'],
  // },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/login',
        destination: 'http://localhost:8000/accounts/login',
        permanent: false,
        basePath: false
      },
    ]
  },
}

module.exports = nextConfig
