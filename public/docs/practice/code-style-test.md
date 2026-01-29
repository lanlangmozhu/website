---
slug: code-style-test
title: 代码高亮与样式渲染测试
excerpt: 本文用于测试网站的代码块渲染效果，包含多种主流编程语言的语法高亮演示。
date: 2025-03-17
author: 小菜权
readTime: 3 分钟
tags: [测试, 样式, 代码高亮]
category: Practice
subcategory: 样式/测试
image: https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=80
---

## 代码块样式测试

本页面用于测试 `MarkdownRenderer` 组件对代码块的渲染能力，包括 **Mac 风格窗口头部**、**语法高亮 (Atom One Dark)** 以及**一键复制**功能。

### 1. JavaScript / TypeScript

测试关键字、函数、注释和字符串的高亮。

```typescript
// 定义一个接口
interface User {
  id: number;
  username: string;
  isAdmin?: boolean;
}

/**
 * 获取用户信息的异步函数
 * @param id 用户ID
 */
async function fetchUser(id: number): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return {
      id: data.id,
      username: data.name, // Mapping field
      isAdmin: false
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

// 调用示例
const user = await fetchUser(10086);
console.log(`Hello, ${user?.username || 'Guest'}!`);
```

### 2. CSS / SCSS

测试属性值、选择器和颜色显示。

```css
:root {
  --primary-color: #2563eb;
  --text-color: #1e293b;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: linear-gradient(to right, #ff7e5f, #feb47b);
}

/* 伪类与伪元素 */
.button:hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}
```

### 3. HTML / JSX

测试标签结构嵌套。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="app">
        <!-- 这是一个注释 -->
        <h1 class="title" data-id="123">Hello World</h1>
        <button onclick="alert('Clicked!')">Click Me</button>
    </div>
</body>
</html>
```

### 4. Python

测试 Python 特有的关键字。

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# List comprehension
squares = [x**2 for x in range(10)]
print(f"Sorted Array: {quick_sort([3,6,8,10,1,2,1])}")
```

### 5. JSON

测试配置文件格式。

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "private": true
}
```

### 6. Bash / Shell

测试命令行指令。

```bash
# 安装依赖
npm install @google/genai

# 运行开发服务器
npm run dev

# 构建项目 (长文本测试滚动条)
echo "Building the project for production environment with extensive optimization..."
docker build -t my-app:latest . --no-cache --progress=plain
```

### 7. 行内代码测试

这是普通的文本，中间插入了 `const a = 10;` 这样的行内代码，或者像 `npm install` 这样的命令，样式应该与正文区分开来，且颜色应适配黑白模式。
