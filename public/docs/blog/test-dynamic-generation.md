---
slug: test-dynamic-generation
title: 网站功能测试：动态文章生成验证
excerpt: 这是一篇自动生成的测试文章，用于验证 Next.js 风格的静态文件加载与分类路由功能是否正常工作。
date: 2025-03-16
author: 小菜权
readTime: 1 分钟
tags: [测试, 架构, React]
category: Blog
subcategory: 其他/系统测试
image: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80
---

## 测试成功

如果你在**首页**的"最新动态"或者**博客页面**的"其他 -> 系统测试"分类下看到了这篇文章，说明网站的动态 Markdown 加载系统运行正常！

这篇文章主要用于验证 Next.js 15 的静态导出功能与动态路由生成机制是否正常工作。通过这篇文章，我们可以确认整个内容管理系统能够正确扫描文件系统、解析 Frontmatter 元数据，并生成对应的静态 HTML 页面。

### 工作原理

本网站基于 Next.js 15 + App Router 构建，采用静态导出模式（Static Export），通过文件系统扫描自动读取 Markdown 文章内容：

#### 1. 文件存储结构

文章按照分类分别存储在 `public/docs/` 目录下的不同子文件夹中：

- `blog/` - 技术博客文章
- `practice/` - 实践项目文档
- `ai/` - AI 相关探索

这种目录结构设计使得内容管理更加清晰，同时便于后续扩展新的分类。

#### 2. 元数据解析机制

每篇文章都使用 YAML Frontmatter 定义元数据，包括：

- **slug**: 文章的唯一标识符，用于生成 URL
- **title**: 文章标题
- **excerpt**: 文章摘要，用于列表页展示
- **date**: 发布日期
- **tags**: 标签数组，用于分类和搜索
- **category**: 主分类（Blog、Practice、AI）
- **subcategory**: 子分类，支持多级分类

系统在构建时会解析这些元数据，并生成对应的 JSON 文件（`posts-list.json`）供前端使用。

#### 3. 动态路由生成

Next.js 的 `generateStaticParams` 函数会在构建时扫描所有文章，为每篇文章生成对应的静态路由：

```typescript
export async function generateStaticParams() {
  // 读取文章列表
  const postsList = JSON.parse(fs.readFileSync('public/posts-list.json', 'utf-8'));
  
  // 为每篇文章生成 slug 参数
  return postsList.map(post => ({ slug: post.slug }));
}
```

这样，构建完成后会生成 `/post/[slug]` 对应的所有静态 HTML 文件，无需运行时动态生成。

#### 4. 构建时优化

在构建过程中，系统会执行以下步骤：

1. **预处理脚本**: 运行 `process-article.ts` 处理所有文章的 Frontmatter
2. **生成文章列表**: 运行 `generate-posts-list.ts` 生成文章索引 JSON
3. **生成 RSS**: 运行 `generate-rss.ts` 生成 RSS 订阅文件
4. **Next.js 构建**: 执行 `next build` 生成静态文件到 `out/` 目录

这种构建时处理的方式确保了最终部署的网站是完全静态的，可以部署到任何静态托管服务。

### 技术优势

相比传统的动态内容管理系统，这种静态生成方式具有以下优势：

- **性能优异**: 所有页面都是预生成的 HTML，加载速度极快
- **SEO 友好**: 搜索引擎可以直接抓取静态 HTML 内容
- **部署简单**: 只需将 `out/` 目录上传到服务器即可
- **成本低廉**: 不需要服务器运行时环境，可以部署到 CDN
- **安全性高**: 没有服务器端代码执行，减少了安全风险

### 分类系统设计

分类系统采用配置驱动的方式，通过 `constants.ts` 中的 `NAV_CONFIG` 定义：

```typescript
export const NAV_CONFIG = [
  { key: 'blog', path: '/blog', folder: 'blog', titleKey: 'nav.blog' },
  { key: 'practice', path: '/practice', folder: 'practice', titleKey: 'nav.practice' },
  { key: 'ai', path: '/ai', folder: 'ai', titleKey: 'nav.ai' },
];
```

这种设计使得添加新分类变得非常简单，只需在配置中添加一项，并在对应的目录下放置文章即可。

### 下一步

你可以尝试以下操作来验证系统功能：

1. **添加新文章**: 在 `public/docs/blog/` 文件夹下创建新的 Markdown 文件，系统会自动识别
2. **修改分类**: 更新文章的 Frontmatter 中的 `category` 字段，重新构建后文章会出现在新的分类下
3. **测试路由**: 访问 `/post/test-dynamic-generation` 查看这篇文章的详情页
4. **检查 RSS**: 访问 `/rss.xml` 查看 RSS 订阅是否包含最新文章

通过这篇文章的测试，我们验证了整个内容管理系统的核心功能都正常工作。这为后续的内容创作和网站维护提供了坚实的基础。
