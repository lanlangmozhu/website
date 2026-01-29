# SEO 优化步骤说明

## `pnpm optimize:seo` 执行的步骤

`optimize:seo` 是一个综合脚本，按顺序执行以下步骤：

### 1. 生成 Sitemap ✅
**脚本**: `generate-sitemap.ts`  
**功能**: 生成 `sitemap.xml` 文件  
**输出**: `public/sitemap.xml`  
**必需**: 是

**作用**:
- 扫描所有文章和静态页面
- 生成符合搜索引擎标准的 sitemap.xml
- 包含 lastmod、changefreq、priority 等信息

---

### 2. 生成 RSS ✅
**脚本**: `generate-rss.ts`  
**功能**: 生成 `rss.xml` 文件  
**输出**: `public/rss.xml`  
**必需**: 是

**作用**:
- 生成 RSS Feed 文件
- 包含所有文章的最新更新
- 支持 RSS 阅读器订阅

---

### 3. 文章 SEO 检查 ✅
**脚本**: `optimize-seo.ts`  
**功能**: 检查文章 SEO 问题并生成报告  
**输出**: `public/seo-report.json`  
**必需**: 是

**检查项**:
- 缺少 excerpt 的文章
- 缺少 tags 的文章
- 图片缺少 alt 文本
- 标题长度问题
- Excerpt 长度问题

**输出报告**:
- 统计信息（总文章数、问题数量等）
- 详细问题列表
- 优化建议

---

### 4. 综合 SEO 检查 ⚠️
**脚本**: `comprehensive-seo-check.ts`  
**功能**: 运行综合 SEO 检查  
**输出**: `public/comprehensive-seo-report.json`  
**必需**: 否（失败不会中断流程）

**检查项**:
- 结构化数据完整性
- 图片优化情况
- 资源提示配置
- PWA Manifest 配置
- Meta 标签完整性
- 文章内容 SEO

**输出报告**:
- 总体得分（0-100）
- 各项检查的详细结果
- 优化建议和优先级

---

## 可选步骤（需要单独运行）

### 文章内容自动化优化
**脚本**: `auto-optimize-content.ts`  
**命令**: `pnpm optimize:content`  
**功能**: 自动修复文章内容层面的 SEO 问题

**优化项**:
- 自动生成缺失的 excerpt
- 优化 excerpt 长度
- 修复过长的标题
- 自动添加缺失的 tags
- 修复缺少 alt 的图片

**使用方式**:
```bash
# 预览模式
pnpm optimize:content:dry

# 实际优化
pnpm optimize:content
```

---

### 验证 SEO 文件（构建后）
**脚本**: `verify-seo-files.ts`  
**命令**: `pnpm verify:seo`  
**功能**: 验证构建后的 SEO 文件

**验证项**:
- sitemap.xml 是否存在且有效
- robots.txt 是否存在且包含 Sitemap 指令
- rss.xml 是否存在且有效

**使用方式**:
```bash
# 构建后验证
pnpm build
pnpm verify:seo
```

---

## 完整工作流

### 开发阶段
```bash
# 1. 运行综合 SEO 优化
pnpm optimize:seo

# 2. 查看报告
cat public/seo-report.json
cat public/comprehensive-seo-report.json

# 3. 优化文章内容（如需要）
pnpm optimize:content:dry  # 预览
pnpm optimize:content      # 实际优化
```

### 构建阶段
```bash
# 1. 运行 SEO 优化（确保文件最新）
pnpm optimize:seo

# 2. 构建项目
pnpm build

# 3. 验证 SEO 文件
pnpm verify:seo
```

### CI/CD 阶段
在 `.github/workflows/ci-cd.yml` 中已包含：
- 生成 sitemap.xml 和 rss.xml
- 验证 SEO 文件
- 检查 index.txt 文件

---

## 脚本依赖关系

```
optimize:seo
├── generate-sitemap.ts (必需)
├── generate-rss.ts (必需)
├── optimize-seo.ts (必需)
└── comprehensive-seo-check.ts (可选)
    └── optimize-seo.ts (复用)

optimize:content (独立)
└── auto-optimize-content.ts

verify:seo (构建后)
└── verify-seo-files.ts
```

---

## 输出文件

### 报告文件
- `public/seo-report.json` - 文章 SEO 检查报告
- `public/comprehensive-seo-report.json` - 综合 SEO 检查报告

### SEO 文件
- `public/sitemap.xml` - 网站地图
- `public/rss.xml` - RSS Feed
- `public/robots.txt` - 爬虫指令（静态文件）

---

## 故障排除

### 问题: 找不到 posts-list.json
**解决**: 先运行 `pnpm generate-posts-list`

### 问题: Sitemap 或 RSS 生成失败
**解决**: 检查 `public/docs/` 目录下是否有文章文件

### 问题: 综合检查失败
**解决**: 这是可选步骤，失败不会影响其他步骤。检查具体错误信息。

---

## 最佳实践

1. **定期运行**: 每次添加新文章后运行 `pnpm optimize:seo`
2. **预览优先**: 使用 `--dry-run` 预览效果
3. **查看报告**: 定期查看生成的 JSON 报告
4. **内容优化**: 使用 `optimize:content` 自动修复内容问题
5. **构建验证**: 构建后运行 `verify:seo` 确保文件正确
