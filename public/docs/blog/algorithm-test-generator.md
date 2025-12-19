---
slug: algorithm-test-generator
title: 算法技巧：编写对数器与测试用例生成器
excerpt: 刷题除了 AC 还能做什么？学会自己编写测试器和对数器，彻底验证算法正确性。
date: 2025-03-15
author: 小菜权
readTime: 8 分钟
tags: [算法, 测试器, 生成器, 对数器]
category: Blog
subcategory: 算法/测试器
image: https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80
---

## 什么是对数器？

在算法练习中，我们经常遇到这种情况：代码通过了样例，但提交后通过率不是 100%，却不知道哪里错了。这时候，**对数器 (Comparator)** 就派上用场了。

### 核心思想

1.  有一个你想要测试的方法 `a` (最优解，可能写错了)。
2.  实现一个绝对正确但是复杂度较高的方法 `b` (暴力解)。
3.  实现一个**随机样本生成器**。
4.  产生大量随机样本，分别跑方法 `a` 和方法 `b`。
5.  比对结果，如果不一致，打印样本进行调试。

### 随机生成器示例

```javascript
// 生成一个长度随机、值随机的数组
function generateRandomArray(maxSize, maxValue) {
    const arr = new Array(Math.floor(Math.random() * (maxSize + 1)));
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * (maxValue + 1)) - Math.floor(Math.random() * maxValue);
    }
    return arr;
}
```

### 验证流程

```javascript
function main() {
    const testTime = 500000;
    const maxSize = 100;
    const maxValue = 100;
    let succeed = true;
    
    for (let i = 0; i < testTime; i++) {
        const arr1 = generateRandomArray(maxSize, maxValue);
        const arr2 = [...arr1]; // copy
        
        mySort(arr1);     // 你的排序算法
        arr2.sort((a,b) => a-b); // 系统的绝对正确算法
        
        if (!isEqual(arr1, arr2)) {
            succeed = false;
            console.log("Oops!", arr1, arr2);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucked!");
}
```

掌握对数器，你就拥有了不用 OJ 也能验证代码正确性的能力。
