/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['mongoose'],
    },
    images: {
      domains: ['images.unsplash.com', 'plus.unsplash.com', 'media.istockphoto.com', 'via.placeholder.com'],
    },
  }
  
  module.exports = nextConfig