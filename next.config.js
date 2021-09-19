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
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=2678400, s-maxage=2678400, stale-while-revalidate=2678400',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2678400, s-maxage=2678400, stale-while-revalidate=2678400',
          },
        ],
      },
    ]
  },
}
