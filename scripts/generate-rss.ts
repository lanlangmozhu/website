#!/usr/bin/env tsx
/**
 * 构建时脚本：生成 RSS XML 文件
 * 用于 RSS 订阅，符合 RSS 2.0 标准
 * 在构建前运行：pnpm build 会自动调用
 */

import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../utils/markdown';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL as CONSTANT_SITE_URL, NAV_CONFIG } from '../constants';

// 加载 .env.local 文件
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          // 移除引号
          const cleanValue = value.replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = cleanValue;
          }
        }
      }
    });
  }
}

// 加载环境变量
loadEnvLocal();

// 站点配置（优先级：环境变量 > constants.ts > 默认值）
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || CONSTANT_SITE_URL || 'https://lanlangmozhu.com';
const SITE_LANGUAGE = 'zh-CN';

const docsPath = path.join(process.cwd(), 'public', 'docs');
const outputPath = path.join(process.cwd(), 'public', 'rss.xml');

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author: string;
  category?: string;
  tags?: string[];
  guid: string;
}

/**
 * 转义 XML 特殊字符
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 格式化日期为 RFC 822 格式（RSS 标准）
 */
function formatRSSDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // 如果日期无效，使用当前日期
      return new Date().toUTCString();
    }
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/**
 * 从 Markdown 内容中提取纯文本摘要（去除 Markdown 语法）
 */
function extractPlainText(markdown: string, maxLength: number = 200): string {
  if (!markdown || markdown.trim() === '') {
    return '';
  }
  
  // 移除代码块
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  // 移除行内代码
  text = text.replace(/`[^`]+`/g, '');
  // 移除链接 [text](url)
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // 移除图片 ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  // 移除标题标记（包括行内和行首）
  text = text.replace(/#+\s+/g, '');
  // 移除粗体/斜体
  text = text.replace(/\*\*([^\*]+)\*\*/g, '$1');
  text = text.replace(/\*([^\*]+)\*/g, '$1');
  // 移除列表标记
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  // 移除 HTML 标签
  text = text.replace(/<[^>]+>/g, '');
  // 移除多余空白和换行
  text = text.replace(/\s+/g, ' ').trim();
  
  if (text.length > maxLength) {
    // 尝试在单词边界截断
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      text = truncated.substring(0, lastSpace) + '...';
    } else {
      text = truncated + '...';
    }
  }
  
  return text;
}

/**
 * 读取所有文章并生成 RSS 条目
 */
function generateRSSItems(): RSSItem[] {
  const items: RSSItem[] = [];
  
  // 读取文章列表
  const postsListPath = path.join(process.cwd(), 'public', 'posts-list.json');
  let relativePaths: string[] = [];
  
  if (fs.existsSync(postsListPath)) {
    try {
      relativePaths = JSON.parse(fs.readFileSync(postsListPath, 'utf-8'));
    } catch (error) {
      console.warn('Failed to read posts-list.json, scanning docs directory...');
    }
  }
  
  // 如果没有文章列表，扫描目录
  if (relativePaths.length === 0) {
    for (const config of NAV_CONFIG) {
      const dirPath = path.join(docsPath, config.folder);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath, { recursive: true });
        const mdFiles = files.filter(
          (file): file is string =>
            typeof file === 'string' && file.endsWith('.md') && !file.startsWith('.')
        );
        mdFiles.forEach((file) => {
          relativePaths.push(`${config.folder}/${file}`);
        });
      }
    }
  }
  
  // 处理每篇文章
  for (const relativePath of relativePaths) {
    const filePath = path.join(docsPath, relativePath);
    
    if (!fs.existsSync(filePath)) {
      continue;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { metadata, content: markdownContent } = parseFrontmatter(content);
      
      // 获取 slug
      let slug = metadata.slug;
      if (!slug) {
        const filename = path.basename(relativePath, '.md');
        slug = filename.replace(/\s+/g, '-').toLowerCase();
      }
      
      // 获取标题
      const title = metadata.title || path.basename(relativePath, '.md');
      
      // 获取摘要（优先使用 frontmatter 中的 excerpt，否则从内容提取）
      let description = metadata.excerpt || '';
      if (!description || description.trim() === '') {
        description = extractPlainText(markdownContent, 200);
      } else {
        // 如果 excerpt 是 Markdown，转换为纯文本
        description = extractPlainText(description, 200);
      }
      
      // 确保描述不为空（如果仍为空，使用标题）
      if (!description || description.trim() === '') {
        description = title;
      }
      
      // 获取日期
      const date = metadata.date || new Date().toISOString().split('T')[0];
      
      // 获取作者
      const author = metadata.author || '小菜权';
      
      // 生成链接（对 slug 进行 URL 编码）
      const encodedSlug = encodeURIComponent(slug);
      const link = `${SITE_URL}/post/${encodedSlug}`;
      
      // 生成 GUID（使用链接作为唯一标识）
      const guid = link;
      
      items.push({
        title,
        link,
        description,
        pubDate: formatRSSDate(date),
        author,
        category: metadata.category,
        tags: metadata.tags || [],
        guid,
      });
    } catch (error) {
      console.error(`Error processing ${relativePath}:`, error);
    }
  }
  
  // 按日期排序（最新的在前）
  items.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });
  
  return items;
}

/**
 * 生成 RSS XML
 */
function generateRSS(): string {
  const items = generateRSSItems();
  const now = new Date().toUTCString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
`;

  // 添加文章条目
  for (const item of items) {
    xml += `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <author>${escapeXml(item.author)}</author>
      <guid isPermaLink="true">${item.guid}</guid>
`;
    
    // 添加分类
    if (item.category) {
      xml += `      <category>${escapeXml(item.category)}</category>
`;
    }
    
    // 添加标签（作为分类，过滤空标签）
    if (item.tags && item.tags.length > 0) {
      for (const tag of item.tags) {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          xml += `      <category>${escapeXml(trimmedTag)}</category>
`;
        }
      }
    }
    
    xml += `    </item>
`;
  }
  
  xml += `  </channel>
</rss>`;
  
  return xml;
}

/**
 * 主函数
 */
function main() {
  console.log('📡 Generating RSS feed...');
  
  try {
    // 检查站点 URL 配置
    if (SITE_URL === 'https://your-domain.com' || !SITE_URL || SITE_URL.includes('your-domain')) {
      console.warn('⚠️  SITE_URL not properly configured, using default. Set SITE_URL or NEXT_PUBLIC_SITE_URL environment variable, or update constants.ts');
    }
    console.log(`🌐 Using SITE_URL: ${SITE_URL}`);
    
    const rssXml = generateRSS();
    
    // 确保 public 目录存在
    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 写入 XML 文件
    fs.writeFileSync(outputPath, rssXml, 'utf-8');
    
    console.log(`✅ Generated RSS feed: ${outputPath}`);
    console.log(`📊 Total items: ${rssXml.match(/<item>/g)?.length || 0}`);
  } catch (error) {
    console.error('❌ Error generating RSS feed:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { generateRSS };
