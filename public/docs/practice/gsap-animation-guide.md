---
slug: gsap-animation-guide
title: GSAP 动画入门与 React 实战 Demo
excerpt: 拒绝枯燥的代码粘贴，直接在文章中查看 GSAP 动画与 React 状态管理的交互效果。
date: 2025-01-15
author: 小菜权
readTime: 8 分钟
tags: [CSS, 动画, GSAP, 实践, Demo]
category: Practice
subcategory: 动画/GSAP
image: https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80
---

## 为什么要在文章中嵌入 Demo?

在技术博客中，尤其是前端领域，"所见即所得"非常重要。与其让读者去 CodeSandbox 跑代码，不如直接在文章里展示。

本文展示了如何利用本博客的 **Component Mapping** 机制，在 Markdown 中渲染 React 组件。

### 1. GSAP 动画演示

GSAP 是操作 DOM 的利器。下面的 Demo 展示了一个简单的方块，点击后会执行弹跳旋转动画。这在底层是直接操作 DOM 节点的 `transform` 属性，性能极佳。

```demo
{
  "component": "GsapBox",
  "props": {
    "color": "#8b5cf6",
    "label": "点我动画"
  }
}
```

对应的实现代码（精简版）：

```typescript
// 使用 useRef 获取 DOM
const boxRef = useRef(null);

// 使用 gsap.to 执行动画
gsap.to(boxRef.current, {
  rotation: 360,
  scale: 1.2,
  ease: "elastic.out"
});
```

### 2. React 状态管理演示

除了视觉动画，我们还可以嵌入带有复杂逻辑的组件。例如下面这个红绿灯模拟器，它展示了 `useState` 和 `useEffect` 的配合。

你可以点击按钮切换"自动/手动"模式。

```demo
{
  "component": "TrafficLight"
}
```

### 总结

通过这种方式，"实践"类文章不再是干巴巴的代码堆砌，而是变成了互动的游乐场。

如果你也想为你的博客添加这个功能，核心思路是：
1. 使用 `react-markdown` 的自定义组件功能。
2. 拦截特定的代码块语言（如 `demo`）。
3. 解析代码块内容的 JSON 配置。
4. 从组件注册表中动态加载组件并渲染。
