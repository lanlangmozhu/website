---
slug: interview-js-proto
title: JS 面试题：原型链与继承
excerpt: 彻底搞懂 Prototype、__proto__ 和 Constructor 之间的三角关系。
date: 2025-03-05
author: 小菜权
readTime: 8 分钟
tags: [面试, JavaScript, 原型链]
category: Blog
subcategory: 面试题/JS基础
image: https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80
---

## 原型链终极指南

在 JS 面试中，原型链是必考题。

### 核心概念

1.  **prototype**: 只有函数（构造函数）才有的属性，指向原型对象。
2.  **__proto__**: 每个对象都有的属性，指向创建该对象的构造函数的原型。
3.  **constructor**: 原型对象上的属性，指向构造函数本身。

### 原型链查找机制

当访问对象的一个属性时：
1.  先在对象自身查找。
2.  如果没有，通过 `__proto__` 去它的原型上查找。
3.  如果还没有，继续通过原型的 `__proto__` 查找。
4.  直到找到 `Object.prototype.__proto__` (为 null)。

### 寄生组合式继承

这是目前最完美的继承方式：

```javascript
function Parent(name) {
    this.name = name;
}
Parent.prototype.say = function() { console.log(this.name); }

function Child(name, age) {
    Parent.call(this, name); // 1. 继承属性
    this.age = age;
}

// 2. 继承方法 (核心)
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const c = new Child('Tom', 18);
```
