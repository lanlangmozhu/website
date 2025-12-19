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

w
## 测试成功

如果你在**首页**的"最新动态"或者**博客页面**的"其他 -> 系统测试"分类下看到了这篇文章，说明网站的动态 Markdown 加载系统运行正常！

### 工作原理

本网站使用 React + Vite 构建，通过 `import.meta.glob` 自动读取文件夹内容：

1.  **文件存储**: 文章分别存储在 `docs/blog/`, `docs/practice/`, `docs/ai/` 目录下。
2.  **元数据解析**: 通过 YAML Frontmatter 定义标题、分类 (`Blog`) 和子分类 (`其他/系统测试`)。
3.  **动态加载**: 系统构建时自动扫描文件夹，无需手动维护 JSON 列表。

```javascript
// 核心逻辑
const markdownFiles = import.meta.glob('/docs/{blog,practice,ai}/*.md', { eager: true });
```

### 下一步

你可以尝试向 `docs/blog/` 文件夹添加新的 Markdown 文件，网站会自动识别。
