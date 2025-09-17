/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    FLASK_BACKEND_URL: process.env.FLASK_BACKEND_URL || 'https://profitwise-app-2024-9e182e64be35.herokuapp.com'
  }
}

export default nextConfig
