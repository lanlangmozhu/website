# AI 编码代理指南

本文档帮助 AI 编码代理快速理解此代码库的架构、约定和开发流程。

## 架构概述

这是一个基于 **Next.js 15 + App Router + React 19 + TypeScript** 的个人博客网站。项目已从 Vite + React Router 迁移到 Next.js（详见 `MIGRATION.md`）。

### 核心架构模式

- **路由系统**：使用 Next.js App Router，页面定义在 `app/` 目录
- **状态管理**：使用 React Context API（ThemeContext, PostContext, LanguageContext），定义在 `app/providers.tsx`
- **服务层分离**：`services/` 目录包含业务逻辑（`data.ts`, `auth.ts`, `geminiService.ts`）
- **组件结构**：`components/` 为可复用组件，`pages/` 为页面级组件（被 `app/` 路由包装）
- **文档系统**：Markdown 文章存储在 `public/docs/` 目录，通过 API 路由动态扫描

## 关键约定与模式

### 1. Next.js App Router 结构

- **页面路由**：`app/{route}/page.tsx` 定义路由页面
- **动态路由**：`app/post/[slug]/page.tsx` 使用动态参数
- **API 路由**：`app/api/{route}/route.ts` 定义 API 端点
- **客户端组件**：所有使用 hooks、事件处理或浏览器 API 的组件必须添加 `'use client'` 指令

示例：
```typescript
// app/blog/page.tsx - 服务端组件
import { CategoryPage } from '../../pages/CategoryPage';
export default function Page() {
  return <CategoryPage categoryKey="blog" />;
}

// pages/CategoryPage.tsx - 客户端组件
'use client';
import { useContext } from 'react';
```

### 2. 动态路由生成

路由通过 `NAV_CONFIG`（`constants.ts`）动态生成，而非硬编码：

```typescript
// constants.ts
export const NAV_CONFIG: NavConfigItem[] = [
  { key: 'blog', path: '/blog', folder: 'blog', titleKey: 'nav.blog' },
  { key: 'practice', path: '/practice', folder: 'practice', titleKey: 'nav.practice' },
  { key: 'ai', path: '/ai', folder: 'ai', titleKey: 'nav.ai' },
];
```

添加新分类只需在 `NAV_CONFIG` 中添加配置，并在 `locales.ts` 中添加对应的翻译 key。

### 3. 文章加载机制

**重要**：文章通过 API 路由动态扫描文件系统，无需 manifest 文件：

1. **API 路由**：`app/api/posts/route.ts` 扫描 `public/docs/` 目录，根据 `NAV_CONFIG` 遍历配置的文件夹
2. **客户端加载**：`services/data.ts` 的 `loadPosts()` 函数：
   - 调用 `/api/posts` 获取文件列表（相对路径，如 `"blog/post.md"`）
   - 将相对路径映射为完整 URL（`/docs/blog/post.md`）
   - 并行 fetch 所有文章内容
   - 解析 frontmatter 提取元数据
   - 从文件夹路径自动推导分类（`/docs/blog/xyz.md` → category: 'blog'），frontmatter 中的 category 优先

文章存储位置：`public/docs/{blog|practice|ai}/*.md`

### 4. 多语言系统

- 翻译定义在 `locales.ts`，支持 `zh`、`en`、`jp`
- 使用 `LanguageContext`（`app/providers.tsx`）提供 `t(key)` 函数进行翻译
- 翻译 key 使用点号分隔（如 `'nav.blog'`）
- 新增翻译时需在所有语言对象中添加对应 key

### 5. 用户认证（无后端）

- 使用 **FingerprintJS** 生成唯一访客 ID（`services/auth.ts`）
- 用户信息存储在 `localStorage`，仅在客户端可用
- 无真实后端验证，仅用于评论系统标识
- 所有认证相关函数都包含 `typeof window === 'undefined'` 检查

### 6. 主题系统

- 使用 `dark` class 在 `document.documentElement` 上切换（`app/providers.tsx`）
- 主题状态保存在 `localStorage`，支持系统偏好检测
- Tailwind CSS 的 `dark:` 前缀用于暗色模式样式
- 使用 `mounted` 状态避免服务端/客户端 hydration 不匹配

### 7. 样式系统

- **Tailwind CSS**：通过 CDN 在 `app/layout.tsx` 中加载（`https://cdn.tailwindcss.com`）
- Tailwind 配置通过内联脚本注入，包含自定义动画和主题配置
- 自定义动画类：`animate-blob`, `animate-slideDown`, `animate-fadeIn` 等（定义在 `tailwind.config.js`）
- 全局背景使用固定定位的模糊渐变（`components/Layout.tsx`）
- 使用 `@tailwindcss/typography` 插件美化 Markdown 内容

## 数据流

1. **应用启动**：`app/layout.tsx` 渲染 `Providers` 组件
2. **Context 初始化**：`app/providers.tsx` 中 `useEffect` 调用 `loadPosts()`
3. **文章加载**：
   - `loadPosts()` → fetch `/api/posts` → 获取文件列表
   - 并行 fetch 所有文章（`/docs/{category}/{file}.md`）
   - 解析 frontmatter → 推导分类 → 返回 `BlogPost[]`
4. **状态传递**：通过 `PostContext` 提供给所有子组件
5. **路由匹配**：`pages/PostPage.tsx` 通过 props 接收 slug，从 context 中查找对应文章

## 开发流程

### 构建与运行

```bash
pnpm install          # 安装依赖
pnpm run dev          # 开发服务器（Next.js，默认端口 3000）
pnpm run build        # 生产构建
pnpm run start        # 启动生产服务器
pnpm run lint         # 代码检查
```

### 添加新文章

1. 在 `public/docs/{blog|practice|ai}/` 目录创建 `.md` 文件
2. 无需运行任何脚本，API 路由会自动扫描
3. 文章需包含 frontmatter（见下方格式）

### Markdown 文章格式

```markdown
---
title: 文章标题
slug: article-slug
excerpt: 摘要
date: 2024-01-01
author: 作者名
readTime: 5 min
tags: [标签1, 标签2]
category: blog  # 可选，不提供则从文件夹路径推导
subcategory: 子分类（可选）
image: /path/to/image.jpg（可选）
---

正文内容...
```

### 环境变量

- 创建 `.env.local` 文件
- 设置 `GEMINI_API_KEY`（用于 AI 摘要功能，`services/geminiService.ts`）
- Next.js 通过 `process.env` 访问环境变量

## 集成点与依赖

### 外部服务

- **Google Gemini API**：`services/geminiService.ts` 用于文章摘要生成（模型：`gemini-2.5-flash`）
- **Google Analytics**：通过 `AnalyticsTracker` 组件集成，需在 `constants.ts` 配置 `GA_MEASUREMENT_ID`
- **FingerprintJS**：浏览器指纹识别，用于用户标识（仅在客户端运行）

### 关键依赖

- `next`：Next.js 框架（App Router）
- `react` / `react-dom`：React 19
- `react-markdown`：Markdown 渲染
- `gsap`：动画库（在 demos 中使用）
- `lucide-react`：图标库
- `@google/genai`：Google Gemini API 客户端

### CDN 资源

- **Tailwind CSS**：通过 CDN 加载（`app/layout.tsx`）
- **Highlight.js**：代码高亮（通过 CDN 加载，支持 JS/TS/CSS/XML/Bash/JSON）
- **Google Fonts**：Outfit（sans-serif）、JetBrains Mono（monospace）

## 特定实现细节

### 服务端/客户端边界

- **服务端组件**：默认，可访问文件系统、数据库等
- **客户端组件**：必须添加 `'use client'`，可访问浏览器 API、hooks
- **Context 提供者**：`app/providers.tsx` 必须是客户端组件（使用 hooks）
- **API 路由**：`app/api/**/route.ts` 运行在服务端

### 路径与导入

- Next.js 自动处理 `app/` 目录的路由
- 静态文件放在 `public/` 目录，通过 `/docs/...` 访问
- 组件导入使用相对路径或绝对路径（无路径别名配置）

### 评论系统

- `CommentSection` 组件使用 localStorage 存储评论
- 评论关联到文章 slug 和用户 ID（FingerprintJS）
- 无后端，所有数据存储在客户端

### 搜索功能

- `SearchModal` 组件支持 `Cmd+K` / `Ctrl+K` 快捷键
- 搜索基于文章标题、内容、标签
- 搜索结果实时过滤

## 注意事项

1. **客户端组件标记**：所有使用 hooks、事件处理、浏览器 API 的组件必须添加 `'use client'`
2. **Hydration 不匹配**：主题、用户信息等客户端状态需使用 `mounted` 状态避免 SSR 不匹配
3. **文件系统访问**：仅在服务端（API 路由、服务端组件）可访问，客户端通过 fetch 获取
4. **分类推导**：文章分类优先使用 frontmatter，否则从文件夹路径推导（`/docs/blog/` → `blog`）
5. **多语言**：新增翻译 key 时需在 `locales.ts` 的所有语言对象（zh/en/jp）中添加
6. **Tailwind 配置**：通过内联脚本注入，而非配置文件（CDN 模式）
7. **环境变量**：仅在服务端可用，客户端需通过 API 路由传递

## 文件结构参考

- `app/layout.tsx`：根布局，加载 Tailwind、字体、Highlight.js
- `app/providers.tsx`：Context 提供者（主题、文章、语言）
- `app/page.tsx`：首页路由
- `app/api/posts/route.ts`：文章列表 API（扫描文件系统）
- `constants.ts`：配置常量（NAV_CONFIG, ABOUT_DATA 等）
- `services/data.ts`：文章加载逻辑（客户端）
- `services/auth.ts`：用户认证（基于 localStorage + FingerprintJS）
- `components/Layout.tsx`：全局布局，导航，主题切换
- `pages/PostPage.tsx`：文章详情页
- `utils/markdown.ts`：Frontmatter 解析工具

## 迁移说明

项目已从 Vite + React Router 迁移到 Next.js。旧架构相关文件（如 `vite.config.ts`、`App.tsx`）可能仍存在但已不再使用。参考 `MIGRATION.md` 了解迁移详情。
