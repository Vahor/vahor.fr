/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "static.vahor.fr", "images.unsplash.com",  "www.notion.so", // Notion cover and logo self host
    ],
  },
  optimization: {
    minimize: true,
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=31536000, s-maxage=31536000',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=315576000, s-maxage=315576000',
          },
        ],
      },
    ]
  },
}
