/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 静态导出配置（用于宝塔面板等静态网站部署）
  // 只在生产构建时启用静态导出，开发模式使用正常模式
  ...(process.env.NODE_ENV === 'production' && { 
    output: 'export',
    distDir: 'out', // 明确指定输出目录为 out
    trailingSlash: true, // 生成 ai/index.html 而不是 ai.html，解决静态部署路由问题
  }),
  
  images: {
    domains: ['api.dicebear.com', 'api.qrserver.com', 'images.unsplash.com', 'picsum.photos'],
    // 静态导出时禁用图片优化（需要 Next.js Image Optimization API）
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
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

  // 静态导出时不需要压缩（由服务器处理）
  compress: false,

  // 禁用 x-powered-by 头（安全）
  poweredByHeader: false,

  // 生产环境不生成 source map（可选，提高安全性）
  productionBrowserSourceMaps: false,

};

module.exports = nextConfig;

