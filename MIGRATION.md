# Next.js 迁移说明

项目已成功从 Vite + React Router 迁移到 Next.js。

## 主要变更

1. **路由系统**: 从 React Router 迁移到 Next.js App Router
2. **文件结构**: 使用 Next.js 的 `app` 目录结构
3. **组件**: 所有使用路由的组件已更新为使用 Next.js 的 `Link` 和 `usePathname`/`useRouter`
4. **Context**: Context 提供者已迁移到 `app/providers.tsx`

## 安装依赖

```bash
pnpm install
```

或

```bash
npm install
```

## 环境变量

创建 `.env.local` 文件（参考 `.env.local.example`）：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 运行项目

开发模式：
```bash
pnpm dev
```

构建：
```bash
pnpm build
```

启动生产服务器：
```bash
pnpm start
```

## 目录结构

- `app/` - Next.js App Router 页面和布局
- `components/` - React 组件（已更新为客户端组件）
- `pages/` - 页面组件（已更新为客户端组件）
- `public/docs/` - 静态文档文件（从 `docs/` 复制）
- `services/` - 服务层代码
- `constants.ts` - 常量配置

## 注意事项

1. 静态文件（如 `docs/` 目录）需要放在 `public/` 目录下
2. 所有使用路由的组件都需要添加 `'use client'` 指令
3. 环境变量需要在 `.env.local` 中配置

## 路由映射

- `/` → `app/page.tsx` (首页)
- `/blog` → `app/blog/page.tsx` (博客分类)
- `/practice` → `app/practice/page.tsx` (实践分类)
- `/ai` → `app/ai/page.tsx` (AI 分类)
- `/about` → `app/about/page.tsx` (关于页)
- `/login` → `app/login/page.tsx` (登录页)
- `/post/[slug]` → `app/post/[slug]/page.tsx` (文章详情)

