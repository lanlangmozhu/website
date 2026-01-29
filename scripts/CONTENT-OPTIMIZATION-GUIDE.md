# 文章内容自动化优化指南

## 概述

`auto-optimize-content.ts` 脚本用于自动修复文章内容层面的 SEO 问题，包括自动生成摘要、优化标题长度、添加标签、修复图片 alt 文本等。

## 功能特性

### 1. 自动生成 Excerpt（摘要）
- **问题**: 文章缺少 excerpt 或 excerpt 过短/过长
- **解决方案**: 
  - 从文章内容中智能提取前几段作为摘要
  - 自动优化摘要长度（目标：120-160 字符）
  - 移除代码块、链接、图片等干扰内容

### 2. 优化标题长度
- **问题**: 标题超过 60 字符（SEO 最佳实践）
- **解决方案**: 自动截断过长的标题，保留前 57 字符 + "..."

### 3. 自动添加 Tags（标签）
- **问题**: 文章缺少 tags
- **解决方案**: 
  - 从分类推导基础标签
  - 从标题中提取关键词
  - 从内容中识别技术术语
  - 最多添加 5 个相关标签

### 4. 修复图片 Alt 文本
- **问题**: Markdown 中的图片缺少 alt 属性
- **解决方案**: 从文件名或路径自动生成描述性 alt 文本

## 使用方法

### 预览模式（推荐先运行）

```bash
# 使用 npm 脚本
pnpm optimize:content:dry

# 或直接运行
pnpm tsx scripts/auto-optimize-content.ts --dry-run
```

预览模式会显示所有将要进行的优化，但不会实际修改文件。

### 实际优化

```bash
# 使用 npm 脚本
pnpm optimize:content

# 或直接运行
pnpm tsx scripts/auto-optimize-content.ts
```

实际优化会：
1. 自动备份原文件到 `public/docs-backup/` 目录
2. 应用所有优化
3. 显示详细的优化报告

### 查看帮助

```bash
pnpm tsx scripts/auto-optimize-content.ts --help
```

## 优化示例

### 示例 1: 添加缺失的 Excerpt

**优化前**:
```yaml
---
slug: es6
title: es6
excerpt: 
date: 2025-12-18
---
```

**优化后**:
```yaml
---
slug: es6
title: es6
excerpt: ES6 (ECMAScript 2015) 核心特性 ES6（ECMAScript 2015）是 JavaScript 语言的一次重大更新，引入了许多新特性，极大地提升了 JavaScript 的开发体验和表达能力。
date: 2025-12-18
---
```

### 示例 2: 优化过短的 Excerpt

**优化前**:
```yaml
excerpt: ES6 核心特性介绍
```

**优化后**:
```yaml
excerpt: ES6 (ECMAScript 2015) 核心特性 ES6（ECMAScript 2015）是 JavaScript 语言的一次重大更新，引入了许多新特性，极大地提升了 JavaScript 的开发体验和表达能力。本文将介绍 ES6 中最重要和最常用的特性。
```

### 示例 3: 添加缺失的 Tags

**优化前**:
```yaml
tags: []
```

**优化后**:
```yaml
tags: [博客, JavaScript, ES6]
```

### 示例 4: 修复图片 Alt 文本

**优化前**:
```markdown
![](/images/example.png)
```

**优化后**:
```markdown
![example](/images/example.png)
```

## 备份和恢复

### 备份位置
所有优化前的文件会自动备份到：
```
public/docs-backup/
```

备份目录结构与原目录相同，例如：
```
public/docs-backup/blog/es6.md
```

### 恢复文件
如果需要恢复某个文件：

```bash
# 恢复单个文件
cp public/docs-backup/blog/es6.md public/docs/blog/es6.md

# 恢复整个目录
cp -r public/docs-backup/* public/docs/
```

## 优化统计

脚本运行后会显示详细的统计信息：

```
============================================================
优化结果汇总:
============================================================
总文章数: 32
已优化: 19
无需优化: 13
错误: 0

详细变化:
  - 添加 excerpt: 3
  - 优化 excerpt: 16
  - 修复标题: 0
  - 添加 tags: 0
  - 修复图片: 0
```

## 最佳实践

### 1. 先预览，后优化
```bash
# 第一步：预览
pnpm optimize:content:dry

# 第二步：检查预览结果
# 如果满意，执行实际优化
pnpm optimize:content
```

### 2. 定期运行
建议在以下情况运行：
- 添加新文章后
- 批量更新文章前
- 定期 SEO 检查时

### 3. 结合其他 SEO 工具
```bash
# 1. 优化文章内容
pnpm optimize:content

# 2. 运行综合 SEO 检查
pnpm check:seo

# 3. 构建并验证
pnpm build
```

## 注意事项

1. **备份**: 脚本会自动备份，但建议在运行前先提交 Git
2. **预览**: 始终先运行预览模式检查结果
3. **手动审查**: 自动生成的 excerpt 和 tags 可能需要手动调整
4. **Git 提交**: 优化后记得提交更改

## 故障排除

### 问题: 脚本找不到 posts-list.json
**解决**: 确保已运行过构建或生成文章列表：
```bash
pnpm generate-posts-list
```

### 问题: 备份目录权限错误
**解决**: 确保有写入权限：
```bash
chmod -R 755 public/docs-backup
```

### 问题: Excerpt 提取不准确
**解决**: 脚本提取的 excerpt 可能需要手动调整，这是正常的。可以：
1. 运行预览模式查看结果
2. 手动编辑不满意的 excerpt
3. 重新运行脚本（已优化的不会重复优化）

## 技术细节

### Excerpt 提取算法
1. 移除代码块、链接、图片等干扰内容
2. 提取前几段文本
3. 在句号处截断，保持完整性
4. 目标长度：120-160 字符

### Tags 提取算法
1. 从分类推导基础标签
2. 从标题中提取关键词
3. 从内容中识别技术术语
4. 去重并限制最多 5 个标签

### 图片 Alt 提取
1. 从文件名提取（去除扩展名和路径）
2. 将连字符和下划线转换为空格
3. 如果无法提取，使用默认值"文章配图"

## 相关脚本

- `scripts/optimize-seo.ts` - SEO 检查脚本
- `scripts/comprehensive-seo-check.ts` - 综合 SEO 检查
- `scripts/auto-optimize-all.ts` - 自动化优化所有项

## 更新日志

- **v1.0.0** (2026-01-29)
  - 初始版本
  - 支持自动生成 excerpt
  - 支持优化 excerpt 长度
  - 支持自动添加 tags
  - 支持修复图片 alt 文本
  - 支持预览模式
  - 自动备份功能
