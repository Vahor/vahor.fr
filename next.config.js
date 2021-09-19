/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "static.vahor.fr", // Notion cover and logo self host
    ],
  },
  optimization: {
    minimize: true,
  }
}
