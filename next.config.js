/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 移除响应头指纹
  poweredByHeader: false,

  // ── 关键：Vercel Serverless 打包 ──
  // API 路由通过 fs.readFileSync('content/...') 读取 Markdown。
  // Next.js 默认只追踪 import 依赖，不会打包这些运行时读取的文件，
  // 必须显式声明，否则线上 API 会因找不到文件而失败。
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['./content/**/*'],
    },
  },

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
