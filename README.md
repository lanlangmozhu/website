# 小菜权的个人网站

个人博客网站，基于 Next.js 15 + React 19 构建。

## 功能特性

- 📝 Markdown 文章系统
- 🌍 多语言支持（中文、英文、日文）
- 🎨 暗色/亮色主题切换
- 🔍 全文搜索
- 💬 评论系统
- 🤖 AI 摘要生成
- 🔐 第三方登录（GitHub、Apple、WeChat）

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 环境变量

创建 `.env.local` 文件：

```env
GEMINI_API_KEY=your_gemini_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here  # 可选，用于图片搜索
SITE_URL=https://your-domain.com  # RSS 和站点链接使用，可选

# OAuth 第三方登录配置（可选）
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
NEXT_PUBLIC_APPLE_CLIENT_ID=your_apple_client_id
NEXT_PUBLIC_WECHAT_APP_ID=your_wechat_app_id

# OAuth 回调 URL 基础地址（可选，不设置则使用当前域名）
# 用于配置线上环境的回调地址，必须与 GitHub OAuth App 中配置的回调 URL 一致
NEXT_PUBLIC_SITE_URL=https://your-domain.com
# 或者单独配置 OAuth 回调基础地址
NEXT_PUBLIC_OAUTH_REDIRECT_BASE_URL=https://your-domain.com

# OAuth 后端 API 地址（用于 token 交换，必须）
# 由于安全原因，client_secret 不能暴露在前端，需要通过后端 API 处理
NEXT_PUBLIC_OAUTH_API_URL=https://your-backend-api.com/auth
```

### 运行开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 文章管理

### 添加新文章

1. 在 `public/docs/{分类}/` 目录下创建 `.md` 文件
2. 分类包括：`blog`、`practice`、`ai`
3. 文章会自动加载，无需额外配置

### 自动补全 Frontmatter

系统提供了自动补全文章 YAML frontmatter 的功能：

#### 方法 1：使用命令行工具

```bash
# 处理单篇文章
pnpm process-article ai/gemini3-pro-使用感受.md

# 处理所有文章
pnpm process-article --all
```

#### 方法 2：使用 API 端点

```bash
# 处理单篇文章
curl -X POST http://localhost:3000/api/process-article \
  -H "Content-Type: application/json" \
  -d '{"filePath": "ai/gemini3-pro-使用感受.md"}'

# 处理所有文章
curl http://localhost:3000/api/process-article?all=true
```

### Frontmatter 格式

```yaml
---
slug: article-slug
title: 文章标题
excerpt: 文章摘要
date: 2024-01-01
author: 小菜权
readTime: 5 分钟
tags: [标签1, 标签2]
category: ai
subcategory: AI 探索
image: https://images.unsplash.com/...
---
```

### 自动补全功能说明

- **检查 frontmatter**：自动检测文章是否已有 frontmatter
- **补全缺失字段**：如果已有 frontmatter，只补全缺失的字段
- **生成新 frontmatter**：如果没有 frontmatter，根据文章内容生成
- **AI 生成**：使用 Gemini AI 生成标题、摘要、标签
- **图片搜索**：从 Unsplash 搜索与文章相关的图片

## RSS 订阅

项目会自动生成 RSS 订阅源 (`/rss.xml`)，包含所有文章的最新更新。

### 生成 RSS

RSS 文件会在构建时自动生成，也可以手动运行：

```bash
pnpm generate-rss
```

### 配置站点 URL

为了生成正确的 RSS 链接，请在环境变量中设置站点 URL：

```env
SITE_URL=https://your-domain.com
# 或
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

如果不设置，RSS 将使用默认的占位符 URL。

## OAuth 第三方登录

项目支持 GitHub、Apple、WeChat 第三方登录。由于安全原因，OAuth token 交换需要通过后端 API 处理。

### 配置步骤

1. **GitHub OAuth App**
   - 访问 [GitHub Developer Settings](https://github.com/settings/developers)
   - 创建新的 OAuth App
   - **重要**：设置 Authorization callback URL 必须与代码中的 redirect_uri 完全一致
     - 开发环境：`http://localhost:3000/auth/callback/github`
     - 生产环境：`https://your-domain.com/auth/callback/github`（需要配置 `NEXT_PUBLIC_SITE_URL` 环境变量）
   - 获取 Client ID，配置到 `NEXT_PUBLIC_GITHUB_CLIENT_ID`
   - **注意**：如果回调 URL 不匹配，GitHub 会返回 404 错误

2. **Apple Sign In**
   - 访问 [Apple Developer](https://developer.apple.com/)
   - 创建 App ID 并启用 Sign in with Apple
   - 配置 Service ID 和回调 URL
   - 获取 Client ID，配置到 `NEXT_PUBLIC_APPLE_CLIENT_ID`

3. **微信开放平台**
   - 访问 [微信开放平台](https://open.weixin.qq.com/)
   - 创建网站应用
   - 设置授权回调域名
   - 获取 AppID，配置到 `NEXT_PUBLIC_WECHAT_APP_ID`

4. **后端 API**
   - 需要实现以下 API 端点来处理 token 交换：
     - `POST /api/auth/github` - 处理 GitHub OAuth
     - `POST /api/auth/apple` - 处理 Apple Sign In
     - `POST /api/auth/wechat` - 处理微信 OAuth
   - 设置 `NEXT_PUBLIC_OAUTH_API_URL` 指向后端 API 地址

### 注意事项

- 由于项目使用静态导出，OAuth 回调页面需要部署在可访问的域名上
- `client_secret` 和 `app_secret` 绝对不能暴露在前端代码中
- 建议使用环境变量管理所有敏感配置

## 项目结构

```
├── app/              # Next.js App Router
│   └── auth/         # OAuth 回调处理
├── components/       # React 组件
├── pages/            # 页面组件
├── public/
│   └── docs/         # Markdown 文章
├── services/         # 服务层
│   ├── data.ts       # 文章加载
│   ├── auth.ts       # 用户认证
│   ├── oauth.ts      # OAuth 授权服务
│   ├── geminiService.ts  # AI 服务
│   ├── frontmatterService.ts  # Frontmatter 生成
│   └── unsplashService.ts     # 图片搜索
├── utils/            # 工具函数
└── scripts/          # 脚本工具
```

## 技术栈

- **框架**：Next.js 15
- **UI**：React 19 + Tailwind CSS
- **AI**：Google Gemini API
- **图片**：Unsplash API
- **类型**：TypeScript

## 许可证

MIT
