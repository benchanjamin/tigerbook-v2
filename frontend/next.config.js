/** @type {import('next').NextConfig} */
const nextConfig = {
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
