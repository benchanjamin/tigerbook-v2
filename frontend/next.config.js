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
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:userId(@[a-zA-Z0-9]+)',
        destination: "/user/:userId",
      },
      {
        source: '/accounts/login',
        destination: "api.tiger-book.com/accounts/login",
      }
    ]
  }
}

module.exports = nextConfig
