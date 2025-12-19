---
slug: knowledge-browser-render
title: 浏览器知识：从输入 URL 到页面展示
excerpt: 全链路解析 DNS 解析、TCP 握手、渲染流程与回流重绘。
date: 2025-02-25
author: 小菜权
readTime: 12 分钟
tags: [知识, 浏览器, 渲染]
category: Blog
subcategory: 知识/浏览器底层原理
image: https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80
---

## 渲染核心流程

当 HTML 文档被下载后，浏览器内核（渲染引擎）开始工作：

1.  **解析 HTML**: 构建 DOM 树。
2.  **解析 CSS**: 构建 CSSOM 树。
3.  **构建 Render Tree**: DOM 树 + CSSOM 树 = 渲染树 (Render Tree)。注意：`display: none` 的元素不在渲染树中。
4.  **布局 (Layout)**: 计算每个节点在屏幕上的位置和大小 (回流 Reflow)。
5.  **绘制 (Paint)**: 填充像素 (颜色、背景、阴影)。
6.  **合成 (Composite)**: 将多个层 (Layer) 合成到一起，由 GPU 处理。

### 回流 (Reflow) vs 重绘 (Repaint)

*   **回流**: 布局改变（宽高、位置、文档流变化）。**成本高**。
*   **重绘**: 样式改变但不影响布局（颜色、背景）。**成本低**。

**优化策略**:
*   避免频繁读取导致回流的属性 (如 `offsetTop`)。
*   使用 `transform` 和 `opacity` 做动画 (触发 GPU 硬件加速，不触发回流)。
*   批量修改 DOM (使用 Fragment)。
