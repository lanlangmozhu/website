---
slug: es6
title: es6
excerpt: 
date: 2025-12-18
author: 小菜权
readTime: 1 分钟
tags: []
category: blog
image: https://picsum.photos/seed/62/1200/600
---

## ES6 (ECMAScript 2015) 核心特性

ES6（ECMAScript 2015）是 JavaScript 语言的一次重大更新，引入了许多新特性，极大地提升了 JavaScript 的开发体验和表达能力。本文将介绍 ES6 中最重要和最常用的特性。

### 1. 变量声明：let 和 const

ES6 引入了 `let` 和 `const` 关键字，解决了 `var` 的一些问题：

- **let**: 块级作用域变量，不存在变量提升
- **const**: 常量声明，声明后不能重新赋值

```javascript
// 块级作用域
if (true) {
  let x = 1;
  const y = 2;
  // x 和 y 只在这个块内有效
}

// const 声明的对象可以修改属性
const obj = { name: 'test' };
obj.name = 'new name'; // 允许
obj = {}; // 报错
```

### 2. 箭头函数

箭头函数提供了更简洁的函数语法，并且自动绑定 `this`：

```javascript
// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// 单个参数可以省略括号
const square = x => x * x;

// 返回对象需要加括号
const createObj = () => ({ name: 'test' });
```

### 3. 模板字符串

模板字符串使用反引号（`）定义，支持多行字符串和变量插值：

```javascript
const name = '小菜权';
const age = 25;

// 传统方式
const message = '我叫' + name + '，今年' + age + '岁';

// 模板字符串
const message = `我叫${name}，今年${age}岁`;

// 多行字符串
const multiLine = `
  第一行
  第二行
  第三行
`;
```

### 4. 解构赋值

解构赋值允许从数组或对象中提取值，并赋给变量：

```javascript
// 数组解构
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4]; // rest = [2, 3, 4]

// 对象解构
const { name, age } = { name: 'test', age: 25 };
const { name: userName, age: userAge } = { name: 'test', age: 25 };

// 默认值
const { name = '默认名', age = 0 } = {};
```

### 5. 扩展运算符

扩展运算符（`...`）可以将数组或对象展开：

```javascript
// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// 函数参数
function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}
```

### 6. Promise 和异步编程

Promise 提供了更好的异步编程解决方案：

```javascript
// Promise 基本用法
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});

promise
  .then(value => console.log(value))
  .catch(error => console.error(error));

// Promise.all - 等待所有 Promise 完成
Promise.all([promise1, promise2, promise3])
  .then(values => console.log(values));

// Promise.race - 返回最先完成的 Promise
Promise.race([promise1, promise2])
  .then(value => console.log(value));
```

### 7. 类和继承

ES6 引入了 `class` 关键字，提供了更清晰的面向对象编程语法：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }
}
```

### 8. 模块化

ES6 提供了原生的模块系统：

```javascript
// 导出
export const name = 'test';
export function greet() {
  console.log('Hello');
}

// 默认导出
export default class MyClass {}

// 导入
import { name, greet } from './module.js';
import MyClass from './module.js';
import * as module from './module.js';
```

### 9. Map 和 Set

ES6 引入了新的数据结构：

```javascript
// Map - 键值对集合
const map = new Map();
map.set('key', 'value');
map.get('key'); // 'value'
map.has('key'); // true

// Set - 值唯一集合
const set = new Set([1, 2, 3]);
set.add(4);
set.has(3); // true
set.size; // 4
```

### 10. 其他重要特性

- **Symbol**: 创建唯一标识符
- **Proxy**: 对象代理，可以拦截对象操作
- **Reflect**: 提供操作对象的方法
- **Generator**: 生成器函数，可以暂停和恢复执行
- **async/await**: 基于 Promise 的异步语法糖（ES2017）

ES6 的这些特性极大地提升了 JavaScript 的开发效率，是现代前端开发的基础。掌握这些特性对于成为一名优秀的前端开发者至关重要。
