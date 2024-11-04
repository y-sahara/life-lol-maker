/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    LLAMA_API_KEY: process.env.LLAMA_API_KEY,
  },
}

module.exports = nextConfig