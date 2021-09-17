/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["static.vahor.fr", "www.notion.so"], // todo retirer les domaines de test
  },
  optimization: {
    minimize: true,
  },
}
