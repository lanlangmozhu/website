# SEO 优化配置文档

本文档列出了网站已实现的所有 SEO 优化功能。

## 📋 已实现的 SEO 优化

### 1. **Sitemap.xml 自动生成**
- ✅ 自动扫描所有静态页面和文章
- ✅ 生成符合 XML Sitemap 标准的文件
- ✅ 包含优先级、更新频率、最后修改时间
- ✅ 构建时自动生成

**文件**: `scripts/generate-sitemap.ts`
**输出**: `public/sitemap.xml`

### 2. **Robots.txt 配置**
- ✅ 允许所有搜索引擎爬虫访问
- ✅ 禁止爬取 API、_next、index.txt 等
- ✅ 指定 sitemap.xml 位置

**文件**: `public/robots.txt`

### 3. **Meta 标签优化**

#### 根布局 (app/layout.tsx)
- ✅ 完整的 Open Graph 元数据（社交媒体分享）
- ✅ Twitter Card 元数据
- ✅ 搜索引擎 robots 配置
- ✅ 关键词、作者信息
- ✅ RSS 订阅链接
- ✅ 移动端优化（viewport、Apple Web App）
- ✅ 主题颜色配置

#### 文章页面 (app/post/[slug]/page.tsx)
- ✅ 每篇文章独立的 SEO metadata
- ✅ 动态生成标题、描述、关键词
- ✅ Open Graph 和 Twitter Card
- ✅ 文章发布时间、作者信息
- ✅ Canonical URL

### 4. **结构化数据 (JSON-LD)**

#### 网站级结构化数据
- ✅ WebSite schema（网站信息）
- ✅ Person schema（作者信息）
- ✅ SearchAction（搜索功能）

#### 文章级结构化数据
- ✅ BlogPosting schema（每篇文章）
- ✅ 包含标题、描述、图片、发布时间
- ✅ 作者和发布者信息
- ✅ 关键词和分类

**位置**: 
- 网站级：`app/layout.tsx`
- 文章级：`app/post/[slug]/page.tsx`

### 5. **图片 SEO 优化**

#### MarkdownRenderer 组件增强
- ✅ 自动为图片添加 alt 属性（如果没有）
- ✅ 图片懒加载（loading="lazy"）
- ✅ 异步解码（decoding="async"）
- ✅ 外部链接自动添加 rel="noopener noreferrer"

**文件**: `components/MarkdownRenderer.tsx`

### 6. **SEO 分析和优化脚本**

#### SEO 优化脚本 (scripts/optimize-seo.ts)
- ✅ 检查文章是否有 excerpt
- ✅ 检查文章是否有 tags
- ✅ 检查图片是否有 alt 文本
- ✅ 检查标题长度（推荐 <60 字符）
- ✅ 检查 excerpt 长度（推荐 120-160 字符）
- ✅ 生成详细的 SEO 报告

**使用方法**:
```bash
pnpm optimize:seo
```

**输出**: `public/seo-report.json`

#### SEO 文件验证脚本 (scripts/verify-seo-files.ts)
- ✅ 验证 sitemap.xml 存在且有效
- ✅ 验证 robots.txt 存在且包含 Sitemap 指令
- ✅ 验证 rss.xml 存在且有效
- ✅ 检查文件大小和内容格式

**使用方法**:
```bash
pnpm verify:seo
```

### 7. **RSS Feed 优化**
- ✅ 自动生成 RSS.xml
- ✅ 包含所有文章的最新更新
- ✅ 正确的域名解析
- ✅ 符合 RSS 2.0 标准

**文件**: `scripts/generate-rss.ts`
**输出**: `public/rss.xml`

## 🚀 使用方法

### 构建时自动执行
```bash
pnpm build
```

构建流程会自动：
1. 生成 sitemap.xml
2. 生成 rss.xml
3. 复制 robots.txt 到输出目录
4. 验证所有 SEO 文件

### 手动运行 SEO 分析
```bash
# 分析 SEO 配置并生成报告
pnpm optimize:seo

# 验证 SEO 文件
pnpm verify:seo

# 手动生成 sitemap
pnpm generate-sitemap

# 手动生成 RSS
pnpm generate-rss
```

## 📊 SEO 检查清单

### 文章 Frontmatter 要求
- [ ] `title`: 标题（推荐 <60 字符）
- [ ] `excerpt`: 摘要（推荐 120-160 字符）
- [ ] `tags`: 标签数组（至少 1 个）
- [ ] `date`: 发布日期
- [ ] `author`: 作者名称
- [ ] `image`: 文章配图 URL（可选但推荐）

### Markdown 图片要求
- [ ] 所有图片必须有 alt 文本：`![描述性文本](url)`
- [ ] Alt 文本应该描述图片内容，而不是"图片"或"image"

### 页面要求
- [ ] 每个页面都有唯一的 title
- [ ] 每个页面都有 description
- [ ] 文章页面包含结构化数据

## 🔍 SEO 最佳实践

1. **标题优化**
   - 保持标题简洁（<60 字符）
   - 包含关键词但自然
   - 每页标题唯一

2. **描述优化**
   - 长度 120-160 字符
   - 包含主要关键词
   - 吸引用户点击

3. **图片优化**
   - 所有图片必须有 alt 文本
   - 使用描述性的 alt 文本
   - 优化图片大小和格式

4. **链接优化**
   - 使用描述性链接文本
   - 外部链接添加 rel="noopener noreferrer"
   - 内部链接使用相对路径

5. **结构化数据**
   - 确保 JSON-LD 数据正确
   - 使用 Google Rich Results Test 验证

## 📝 下一步建议

1. **添加 OG 图片**
   - 创建 `/public/images/og-image.png` (1200x630px)
   - 用于社交媒体分享预览

2. **配置搜索引擎验证**
   - 在 `app/layout.tsx` 的 `verification` 中添加验证码
   - Google Search Console
   - Bing Webmaster Tools

3. **提交 Sitemap**
   - 在 Google Search Console 提交 sitemap.xml
   - 在 Bing Webmaster Tools 提交 sitemap.xml

4. **性能优化**
   - 图片压缩和 WebP 格式
   - 代码分割和懒加载
   - CDN 配置

5. **内容优化**
   - 定期运行 `pnpm optimize:seo` 检查问题
   - 修复缺少 excerpt 和 tags 的文章
   - 为所有图片添加 alt 文本

## 🔗 相关文件

- `scripts/generate-sitemap.ts` - Sitemap 生成脚本
- `scripts/generate-rss.ts` - RSS 生成脚本
- `scripts/optimize-seo.ts` - SEO 分析和优化脚本
- `scripts/verify-seo-files.ts` - SEO 文件验证脚本
- `public/robots.txt` - 爬虫规则文件
- `app/layout.tsx` - 根布局 metadata
- `app/post/[slug]/page.tsx` - 文章页面 metadata 和结构化数据
- `components/MarkdownRenderer.tsx` - Markdown 渲染器（图片优化）

## 📚 参考资源

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [XML Sitemaps](https://www.sitemaps.org/)
