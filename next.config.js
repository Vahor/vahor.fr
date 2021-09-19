/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "static.vahor.fr", // Notion cover and logo self host
      "www.notion.so", "images.unsplash.com", "s3.us-west-2.amazonaws.com" // Notion cover
    ],
  },
  optimization: {
    minimize: true,
  }
}
