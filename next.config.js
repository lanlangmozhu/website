/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com', 'api.qrserver.com', 'images.unsplash.com', 'picsum.photos'],
  },
  // 构建输出目录
  distDir: '.next',
  // 生产环境移除 console（保留 error 和 warn）
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 优化包大小 - 按需导入大型库
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
  },

  // 压缩输出
  compress: true,

  // 禁用 x-powered-by 头（安全）
  poweredByHeader: false,

  // 生产环境不生成 source map（可选，提高安全性）
  productionBrowserSourceMaps: false,

  // 设置构建输出目录（默认是 .next）
  distDir: '.next', // 可以修改为其他目录，如 'build' 或 'dist'

};

module.exports = nextConfig;

