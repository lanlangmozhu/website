# 小菜权的个人网站

个人博客网站，基于 Next.js 15 + React 19 构建。

## 功能特性

- 📝 Markdown 文章系统
- 🌍 多语言支持（中文、英文、日文）
- 🎨 暗色/亮色主题切换
- 🔍 全文搜索
- 💬 评论系统
- 🤖 AI 摘要生成

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

## 项目结构

```
├── app/              # Next.js App Router
├── components/       # React 组件
├── pages/            # 页面组件
├── public/
│   └── docs/         # Markdown 文章
├── services/         # 服务层
│   ├── data.ts       # 文章加载
│   ├── auth.ts       # 用户认证
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
