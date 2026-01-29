---
slug: two-sum-algorithm
title: 算法笔记：两数之和与 Hash Map
excerpt: 重温经典 LeetCode 题目，探讨空间换时间的优化思想。
date: 2025-02-20
author: 小菜权
readTime: 5 分钟
tags: [算法, LeetCode, Hash Map]
category: Blog
subcategory: 算法/LeetCode
image: https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80
---

## LeetCode 01: 两数之和 (Two Sum)

在算法面试中，Hash Map 是解决查找问题的利器。

### 题目描述

给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 **两个** 整数，并返回他们的数组下标。

### 解题思路

最直接的方法是双重循环，时间复杂度 $O(n^2)$。但我们可以利用哈希表（Map）来优化到 $O(n)$。

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

这种空间换时间的思想在前端性能优化中也经常用到。
