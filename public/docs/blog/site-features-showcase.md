---
slug: site-features-showcase
title: 本站功能大揭秘：从 Markdown 到炫酷博客
excerpt: 一文带你了解本站背后的技术原理，演示代码高亮、交互式 Demo、Iframe 嵌入以及自动化构建流程。
date: 2025-03-18
author: 小菜权
readTime: 8 分钟
tags: [功能介绍, Markdown, 架构, React]
category: Blog
subcategory: 其他/关于本站
image: https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80
---

## 欢迎来到“NO BUG, NO CODE”

你现在看到的不仅仅是一个静态的 HTML 页面，而是一个由 React 驱动、Markdown 数据源支持的现代化单页应用 (SPA)。

本文将作为**功能展示页 (Showcase)**，带你体验本站强大的渲染能力。

---

## 1. 基础排版与样式

本站采用了 `Tailwind Typography` 插件，并进行了深度的定制，以支持优美的排版和**深色模式 (Dark Mode)** 适配。

> 引用样式：即使是简单的文字，加上引用块也能突显重点。设计细节决定了阅读体验的上限。

*   **列表项 1**：清晰的层级结构。
*   **列表项 2**：自动适配的间距。
    *   嵌套列表：逻辑更清晰。

---

## 2. 极致的代码高亮

对于技术博客来说，代码块的颜值就是正义。本站集成了 `highlight.js` (Atom One Dark 主题) 并封装了自定义的 `CodeBlock` 组件。

**特性支持：**
1.  Mac 终端风格的红绿灯头部。
2.  右上角一键复制。
3.  语言自动识别。

### TypeScript 示例

```typescript
// services/data.ts 核心逻辑片段
export const loadPosts = async (): Promise<BlogPost[]> => {
  // 1. 通过 API 路由获取文件列表（服务端自动扫描目录）
  const response = await fetch('/api/posts');
  const relativePaths = await response.json();
  
  // 2. 并发加载所有 Markdown
  const fetchPromises = relativePaths.map(async (path) => {
      const res = await fetch(`/docs/${path}`);
      return parseFrontmatter(await res.text());
  });
  
  return Promise.all(fetchPromises);
};
```

### CSS 示例

```css
/* 玻璃拟态 (Glassmorphism) 实现 */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

## 3. 魔法：Markdown 中的 React 组件

这是本站最酷的功能。我实现了一种**组件映射机制 (Component Mapping)**。通过在 Markdown 中使用特定的 `demo` 语法块，我可以渲染真实的 React 组件，而不仅仅是静态文本。

### 演示 1：GSAP 动画交互

下面的方块不是 GIF，也不是视频，而是一个活生生的 React 组件。你可以点击它！

```demo
{
  "component": "GsapBox",
  "props": {
    "label": "点我旋转",
    "color": "#ec4899"
  }
}
```

### 演示 2：状态管理模拟

这是一个红绿灯模拟器，展示了 React 的 `useState` 和 `useEffect` 逻辑。

```demo
{
  "component": "TrafficLight"
}
```

**实现原理：**
渲染器拦截 `language-demo` 代码块 -> 解析 JSON 配置 -> 在 `DemoRegistry` 中查找对应组件 -> 动态渲染。

---

## 4. 无缝嵌入外部项目

有时候我们需要展示 GitHub 上的完整项目或 CodePen 创意。本站支持 `embed` 语法，甚至能自动将 GitHub 仓库链接转换为可运行的 **StackBlitz** 沙箱。

### GitHub 自动转换示例

我只需粘贴 GitHub URL，你就能直接阅读和运行源码：

```embed
{
  "src": "https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts",
  "height": "500px",
  "title": "Vite React TS Template"
}
```

---

## 5. 自动化文章发现流程

你可能会好奇，这些文章是如何被网站识别的？

1.  **编写**：我在 `public/docs/` 目录下编写 Markdown 文件，包含 Frontmatter 元数据 (标题、分类、标签等)。
2.  **自动扫描**：Next.js API 路由 (`/api/posts`) 在服务端自动扫描 `public/docs` 目录下的所有子文件夹。
3.  **动态发现**：API 根据 `NAV_CONFIG` 配置自动发现所有 `.md` 文件，无需手动维护索引文件。
4.  **加载**：前端应用在启动时请求 API 获取文件列表，然后并发加载所有文章内容。

这使得我可以在没有后端数据库的情况下，依然拥有一个动态、可扩展的博客系统。添加新文章时，只需将文件放入对应目录即可，系统会自动识别。

---

**EOF**
