/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
  },

  reactStrictMode: true,
  images: {
    domains: [
      "static.vahor.fr", // Notion cover and logo self host
      "www.notion.so", "s3.us-west-2.amazonaws.com" // Notion cover
    ],
  },
  optimization: {
    minimize: true,
  }
}
