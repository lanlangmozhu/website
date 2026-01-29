---
slug: iframe-embed-test
title: Iframe 嵌入与 GitHub 项目预览
excerpt: 无需离开博客，直接在文章中预览 CodePen、StackBlitz 或 GitHub 仓库代码。
date: 2025-03-18
author: 小菜权
readTime: 4 分钟
tags: [测试, Iframe, GitHub]
category: Practice
subcategory: 样式/嵌入
image: https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&w=1200&q=80
---

## 为什么需要 Iframe 嵌入？

在展示完整的前端项目、在线代码编辑器或设计稿时，静态截图往往不够直观。通过 Iframe，我们可以将外部的丰富内容直接无缝集成到博客文章中。

### 1. 嵌入 GitHub 项目 (自动转换)

直接嵌入 GitHub 链接通常会被拒绝访问。但本博客集成了 **StackBlitz 自动转换** 功能。
你只需要填入 GitHub 仓库的 URL，渲染器会自动将其转换为可运行的 StackBlitz 沙箱。

**React 项目示例** (Vite Template):

```embed
{
  "src": "https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react",
  "height": "600px",
  "title": "Vite React Template (GitHub Direct)"
}
```

### 2. 嵌入 CodePen 作品

CodePen 是前端开发者的灵感库。

```embed
{
  "src": "https://codepen.io/hexagoncircle/embed/XWbWzN?default-tab=result",
  "height": "500px",
  "title": "CSS Animation Demo"
}
```

### 3. 嵌入 StackBlitz 项目 (手动配置)

你也可以手动填入配置好的 StackBlitz URL 以获得更精细的控制。

```embed
{
  "src": "https://stackblitz.com/edit/vitejs-vite-c712k8?embed=1&file=src%2FApp.tsx&hideExplorer=1",
  "height": "600px",
  "title": "React Playground"
}
```

### 4. 嵌入普通网页

比如嵌入 Wikipedia 或技术文档页面。

```embed
{
  "src": "https://zh.wikipedia.org/wiki/Wiki",
  "height": "400px",
  "title": "Wikipedia"
}
```

### 实现原理

我们在 `MarkdownRenderer` 中注册了一个新的语言解析器 `embed`。它读取 JSON 配置，如果发现 `src` 是 GitHub 链接，会自动调用 StackBlitz API 进行转换。
