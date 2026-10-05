/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 独立产物，便于容器化/自托管部署
  output: 'standalone',

  // 关闭响应头指纹
  poweredByHeader: false,

  // 安全响应头
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
