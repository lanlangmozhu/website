---
slug: browser-event-loop
title: 深入理解浏览器事件循环
excerpt: 宏任务、微任务与渲染时机，彻底搞懂 JS 的异步机制。
date: 2025-02-18
author: 小菜权
readTime: 8 分钟
tags: [浏览器, JavaScript, 原理]
category: Blog
subcategory: 知识/事件循环
image: https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80
---

## 浏览器底层原理：事件循环 (Event Loop)

JavaScript 是单线程的，但为什么能处理异步操作？答案就是事件循环。

### 宏任务与微任务

1.  **宏任务 (MacroTask)**: `setTimeout`, `setInterval`, I/O, UI Rendering.
2.  **微任务 (MicroTask)**: `Promise.then`, `process.nextTick`, `MutationObserver`.

### 执行顺序

每次执行完一个宏任务（Stack 为空），引擎会优先清空所有的微任务队列，然后再取下一个宏任务。

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// 输出: 1 -> 4 -> 3 -> 2
```

理解这一点对于排查复杂的异步 bug 至关重要。
