# `pnpm optimize:seo` 整合的脚本说明

## 概述

`pnpm optimize:seo` 现在是一个综合脚本，整合了所有 SEO 相关的检查和优化步骤。

---

## 已整合的脚本

### ✅ 1. `generate-sitemap.ts`
**功能**: 生成 sitemap.xml  
**执行顺序**: 第 1 步  
**必需**: 是  
**输出**: `public/sitemap.xml`

**为什么整合**:
- Sitemap 是 SEO 的基础文件
- 需要在每次优化时确保是最新的
- 包含所有页面和文章的最新信息

---

### ✅ 2. `generate-rss.ts`
**功能**: 生成 rss.xml  
**执行顺序**: 第 2 步  
**必需**: 是  
**输出**: `public/rss.xml`

**为什么整合**:
- RSS Feed 有助于内容发现和订阅
- 需要与 sitemap 同步更新
- 确保包含所有最新文章

---

### ✅ 3. `optimize-seo.ts`
**功能**: 检查文章 SEO 问题并生成报告  
**执行顺序**: 第 3 步  
**必需**: 是  
**输出**: `public/seo-report.json`

**为什么整合**:
- 核心的 SEO 检查功能
- 生成详细的文章 SEO 问题报告
- 提供优化建议

**检查项**:
- 缺少 excerpt 的文章
- 缺少 tags 的文章
- 图片缺少 alt 文本
- 标题长度问题
- Excerpt 长度问题

---

### ✅ 4. `comprehensive-seo-check.ts`
**功能**: 运行综合 SEO 检查  
**执行顺序**: 第 4 步  
**必需**: 否（失败不会中断流程）  
**输出**: `public/comprehensive-seo-report.json`

**为什么整合**:
- 提供全面的 SEO 检查
- 检查代码层面的 SEO 配置
- 生成总体得分和优先级建议

**检查项**:
- 结构化数据完整性
- 图片优化情况
- 资源提示配置
- PWA Manifest 配置
- Meta 标签完整性

---

## 未整合的脚本（需要单独运行）

### ⚠️ `auto-optimize-content.ts`
**命令**: `pnpm optimize:content`  
**功能**: 自动优化文章内容

**为什么未整合**:
- 会实际修改文章文件
- 需要用户确认和审查
- 有自动备份功能，需要用户了解

**建议使用方式**:
```bash
# 1. 先运行 SEO 检查
pnpm optimize:seo

# 2. 查看报告，确认需要优化的文章
cat public/seo-report.json

# 3. 预览内容优化
pnpm optimize:content:dry

# 4. 执行内容优化
pnpm optimize:content
```

---

### ⚠️ `verify-seo-files.ts`
**命令**: `pnpm verify:seo`  
**功能**: 验证构建后的 SEO 文件

**为什么未整合**:
- 需要在构建后运行（检查 `out/` 目录）
- `optimize:seo` 在构建前运行（生成 `public/` 文件）
- 属于不同的阶段

**建议使用方式**:
```bash
# 构建后验证
pnpm build
pnpm verify:seo
```

---

### ⚠️ `auto-optimize-all.ts`
**命令**: `pnpm auto:optimize`  
**功能**: 自动化优化代码层面的 SEO

**为什么未整合**:
- 会修改源代码文件
- 主要用于一次性设置
- 大部分优化已经完成

**建议使用方式**:
- 仅在首次设置或重大更新时运行
- 运行前先提交 Git

---

## 执行流程

```
pnpm optimize:seo
│
├─ 1. generate-sitemap.ts
│   └─ 生成 public/sitemap.xml
│
├─ 2. generate-rss.ts
│   └─ 生成 public/rss.xml
│
├─ 3. optimize-seo.ts
│   └─ 生成 public/seo-report.json
│
└─ 4. comprehensive-seo-check.ts (可选)
    └─ 生成 public/comprehensive-seo-report.json
```

---

## 使用示例

### 基本使用
```bash
# 运行所有 SEO 优化步骤
pnpm optimize:seo
```

### 预览模式
```bash
# 预览将执行的步骤（不实际执行）
pnpm optimize:seo --dry-run
```

### 跳过内容优化提示
```bash
# 不显示文章内容优化的提示
pnpm optimize:seo --skip-content
```

### 完整工作流
```bash
# 1. SEO 优化
pnpm optimize:seo

# 2. 查看报告
cat public/seo-report.json

# 3. 优化文章内容（如需要）
pnpm optimize:content:dry  # 预览
pnpm optimize:content      # 执行

# 4. 构建项目
pnpm build

# 5. 验证构建结果
pnpm verify:seo
```

---

## 输出文件

运行 `pnpm optimize:seo` 后会生成：

1. **public/sitemap.xml** - 网站地图
2. **public/rss.xml** - RSS Feed
3. **public/seo-report.json** - 文章 SEO 检查报告
4. **public/comprehensive-seo-report.json** - 综合 SEO 检查报告

---

## 错误处理

- **必需步骤失败**: 会停止执行并显示错误
- **可选步骤失败**: 会跳过并继续执行
- **预览模式**: 不会实际执行，只显示将执行的步骤

---

## 总结

### ✅ 已整合到 `optimize:seo`
1. `generate-sitemap.ts` - 生成 sitemap
2. `generate-rss.ts` - 生成 RSS
3. `optimize-seo.ts` - 文章 SEO 检查
4. `comprehensive-seo-check.ts` - 综合 SEO 检查

### ⚠️ 需要单独运行
1. `auto-optimize-content.ts` - 文章内容优化（`pnpm optimize:content`）
2. `verify-seo-files.ts` - 构建后验证（`pnpm verify:seo`）
3. `auto-optimize-all.ts` - 代码层面优化（`pnpm auto:optimize`）

---

## 相关文档

- `scripts/SEO-OPTIMIZE-STEPS.md` - 详细的步骤说明
- `scripts/CONTENT-OPTIMIZATION-GUIDE.md` - 文章内容优化指南
- `scripts/seo-implementation-plan.md` - SEO 实施计划
