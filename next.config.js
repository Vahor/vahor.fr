/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["static.vahor.fr", "www.notion.so", "s3.us-west-2.amazonaws.com"], // todo retirer les domaines de test
  },
  optimization: {
    minimize: true,
  },
}
