# SEO 优化实施计划

## 概述
本文档详细说明了 SEO 优化的分步实施计划，每个步骤都包含检查脚本和自动化实现脚本。

## 实施步骤

### 步骤 1: 增强文章结构化数据
**目标**: 为文章添加阅读时间、字数统计、面包屑导航等结构化数据

**检查项**:
- [ ] BlogPosting 结构化数据包含 `timeRequired`
- [ ] BlogPosting 结构化数据包含 `wordCount`
- [ ] BlogPosting 结构化数据包含 `BreadcrumbList`
- [ ] 面包屑导航组件已实现并正确渲染

**实现文件**:
- `app/post/[slug]/page.tsx` - 增强 `generateStructuredData` 函数
- `components/Breadcrumb.tsx` - 创建面包屑组件（如不存在）

**检查脚本**: `scripts/check-structured-data.ts`
**自动化脚本**: `scripts/auto-enhance-structured-data.ts`

---

### 步骤 2: 图片性能优化
**目标**: 为所有图片添加性能优化属性

**检查项**:
- [ ] Hero 图片包含 `loading="eager"` 和 `fetchPriority="high"`
- [ ] Hero 图片包含明确的 `width` 和 `height` 属性
- [ ] Markdown 渲染的图片包含 `loading="lazy"` 和 `decoding="async"`
- [ ] 所有图片都有 `alt` 属性

**实现文件**:
- `components/pages/PostPage.tsx` - 优化 Hero 图片
- `components/MarkdownRenderer.tsx` - 优化 Markdown 图片渲染

**检查脚本**: `scripts/check-image-optimization.ts`
**自动化脚本**: `scripts/auto-optimize-images.ts`

---

### 步骤 3: 资源预加载和 DNS 优化
**目标**: 添加 DNS prefetch、preconnect 和 preload 链接

**检查项**:
- [ ] 外部 CDN 资源有 `dns-prefetch` 链接
- [ ] 关键外部资源有 `preconnect` 链接
- [ ] 关键 CSS/JS 资源有 `preload` 链接
- [ ] Highlight.js 脚本已预加载

**实现文件**:
- `app/layout.tsx` - 添加资源提示链接

**检查脚本**: `scripts/check-resource-hints.ts`
**自动化脚本**: `scripts/auto-add-resource-hints.ts`

---

### 步骤 4: PWA Manifest 和图标优化
**目标**: 确保 PWA manifest 和图标配置完整

**检查项**:
- [ ] `public/manifest.json` 存在且格式正确
- [ ] `app/layout.tsx` 包含 manifest 链接
- [ ] Favicon 和 Apple Touch Icon 已配置
- [ ] Manifest 包含所有必需字段

**实现文件**:
- `public/manifest.json` - 创建或更新 manifest
- `app/layout.tsx` - 添加 manifest 和图标链接

**检查脚本**: `scripts/check-pwa-manifest.ts`
**自动化脚本**: `scripts/auto-setup-pwa.ts`

---

### 步骤 5: Meta 标签完整性检查
**目标**: 确保所有页面都有完整的 SEO meta 标签

**检查项**:
- [ ] 所有页面有 `title` 和 `description`
- [ ] 所有页面有 Open Graph 标签
- [ ] 所有页面有 Twitter Card 标签
- [ ] 所有页面有 `canonical` URL
- [ ] 文章页面有 `article:published_time` 和 `article:modified_time`

**实现文件**:
- `app/layout.tsx` - 全局 meta 标签
- `app/post/[slug]/page.tsx` - 文章页面 meta 标签

**检查脚本**: `scripts/check-meta-tags.ts`
**自动化脚本**: `scripts/auto-fix-meta-tags.ts`

---

### 步骤 6: 文章内容自动化优化
**目标**: 自动修复文章内容层面的 SEO 问题

**检查项**:
- [ ] 自动生成缺失的 excerpt
- [ ] 优化 excerpt 长度（50-200 字符）
- [ ] 修复过长的标题（>60 字符）
- [ ] 自动添加缺失的 tags
- [ ] 修复缺少 alt 的图片

**实现文件**:
- `scripts/auto-optimize-content.ts` - 文章内容自动化优化脚本

**功能**:
- 从文章内容中智能提取摘要
- 自动生成相关标签
- 自动修复图片 alt 文本
- 提供预览模式（--dry-run）
- 自动备份原文件

---

### 步骤 7: 综合 SEO 检查
**目标**: 运行所有检查并生成综合报告

**检查项**:
- [ ] 运行所有上述检查脚本
- [ ] 生成综合 SEO 报告
- [ ] 输出优化建议和优先级

**实现文件**:
- `scripts/comprehensive-seo-check.ts` - 综合检查脚本
- `scripts/auto-optimize-all.ts` - 自动化优化脚本

---

## 使用方式

### 1. 运行单个步骤检查
```bash
# 检查结构化数据
pnpm tsx scripts/check-structured-data.ts

# 检查图片优化
pnpm tsx scripts/check-image-optimization.ts

# 检查资源提示
pnpm tsx scripts/check-resource-hints.ts

# 检查 PWA Manifest
pnpm tsx scripts/check-pwa-manifest.ts

# 检查 Meta 标签
pnpm tsx scripts/check-meta-tags.ts
```

### 2. 运行自动化优化
```bash
# 自动增强结构化数据
pnpm tsx scripts/auto-enhance-structured-data.ts

# 自动优化图片
pnpm tsx scripts/auto-optimize-images.ts

# 自动添加资源提示
pnpm tsx scripts/auto-add-resource-hints.ts

# 自动设置 PWA
pnpm tsx scripts/auto-setup-pwa.ts

# 自动修复 Meta 标签
pnpm tsx scripts/auto-fix-meta-tags.ts
```

### 3. 运行文章内容优化
```bash
# 预览模式（不实际修改文件）
pnpm optimize:content:dry
# 或
pnpm tsx scripts/auto-optimize-content.ts --dry-run

# 实际优化文章内容
pnpm optimize:content
# 或
pnpm tsx scripts/auto-optimize-content.ts
```

### 4. 运行综合检查
```bash
# 综合 SEO 检查
pnpm check:seo
# 或
pnpm tsx scripts/comprehensive-seo-check.ts

# 自动优化所有项
pnpm auto:optimize
# 或
pnpm tsx scripts/auto-optimize-all.ts
```

---

## 优先级

1. **高优先级** (立即实施):
   - 步骤 1: 增强文章结构化数据
   - 步骤 2: 图片性能优化
   - 步骤 5: Meta 标签完整性检查
   - 步骤 6: 文章内容自动化优化

2. **中优先级** (尽快实施):
   - 步骤 3: 资源预加载和 DNS 优化
   - 步骤 4: PWA Manifest 和图标优化

3. **低优先级** (持续优化):
   - 步骤 7: 综合 SEO 检查（定期运行）

---

## 注意事项

1. 所有脚本都应该在构建前运行检查
2. 自动化脚本应该生成备份或使用 Git 版本控制
3. 检查脚本应该输出详细的报告和建议
4. 所有修改都应该遵循项目的代码规范
5. 修改后应该运行测试确保功能正常
