---
slug: interview-css-layout
title: CSS 面试题：居中与布局
excerpt: 水平垂直居中的N种写法，以及 Flex 和 Grid 的实战应用。
date: 2025-03-06
author: 小菜权
readTime: 6 分钟
tags: [面试, CSS, 布局]
category: Blog
subcategory: 面试题/CSS布局
image: https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=1200&q=80
---

## 经典面试题：如何实现水平垂直居中？

### 方案一：Flex (推荐)

```css
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 方案二：Grid (最简)

```css
.parent {
    display: grid;
    place-items: center;
}
```

### 方案三：绝对定位 + Transform

```css
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

### BFC 是什么？

块级格式化上下文 (Block Formatting Context)。
**触发条件**:
*   float 不为 none
*   position 为 absolute / fixed
*   overflow 不为 visible
*   display 为 inline-block / flex / grid

**应用场景**:
*   清除浮动
*   防止 margin 重叠
*   自适应两栏布局
