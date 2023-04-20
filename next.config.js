/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "he", "ru"],
    defaultLocale: "en"
  }, 
  images: {
    remotePatterns: [
      {
        protocol: process.env.PROTOCOL,
        hostname: process.env.HOSTNAME
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  }
}

module.exports = nextConfig
