---
slug: algorithm-data-structure
title: 算法基石：常见数据结构回顾
excerpt: 数组、链表、栈、队列、树与图，重温计算机科学的核心基石。
date: 2025-03-12
author: 小菜权
readTime: 10 分钟
tags: [数据结构, 算法, 基础]
category: Blog
subcategory: 算法/数据结构
image: https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80
---

## 为什么数据结构如此重要？

数据结构是算法的载体。选择合适的数据结构，往往能让时间复杂度从 $O(n^2)$ 降为 $O(n \log n)$ 甚至 $O(1)$。

### 1. 线性结构
*   **数组 (Array)**: 内存连续，查找 $O(1)$，插入删除 $O(n)$。
*   **链表 (Linked List)**: 内存不连续，插入删除 $O(1)$，查找 $O(n)$。
*   **栈 (Stack)**: 先入后出 (LIFO)，常见应用：函数调用堆栈。
*   **队列 (Queue)**: 先入先出 (FIFO)，常见应用：任务队列。

### 2. 树形结构
*   **二叉树 (Binary Tree)**: 每个节点最多两个子节点。
*   **二叉搜索树 (BST)**: 左 < 根 < 右，查找效率 $O(\log n)$。
*   **平衡树 (AVL / Red-Black Tree)**: 解决 BST 退化成链表的问题。

### 3. 散列结构
*   **Hash Map**: 利用 Hash 函数将 Key 映射到内存地址，实现 $O(1)$ 查找。

### 代码示例：反转链表

```javascript
function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let next = curr.next; // 暂存后继
        curr.next = prev;     // 反转指向
        prev = curr;          // 指针后移
        curr = next;
    }
    return prev;
}
```
