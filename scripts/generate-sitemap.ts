#!/usr/bin/env tsx
/**
 * 构建时脚本：生成 sitemap.xml 文件
 * 用于搜索引擎爬虫发现和索引网站所有页面
 * 符合 XML Sitemap 协议标准
 */

import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../utils/markdown';
import { SITE_URL as CONSTANT_SITE_URL, NAV_CONFIG } from '../constants';

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
          const cleanValue = value.replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = cleanValue;
          }
        }
      }
    });
  }
}

loadEnvLocal();

// 站点配置
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || CONSTANT_SITE_URL || 'https://lanlangmozhu.com';
const docsPath = path.join(process.cwd(), 'public', 'docs');
const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');

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
 * 格式化日期为 ISO 8601 格式
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * 获取所有静态页面 URL
 */
function getStaticPages(): Array<{ url: string; lastmod: string; changefreq: string; priority: string }> {
  const pages = [
    { path: '', changefreq: 'daily', priority: '1.0' }, // 首页
    { path: '/blog/', changefreq: 'daily', priority: '0.9' },
    { path: '/practice/', changefreq: 'weekly', priority: '0.9' },
    { path: '/ai/', changefreq: 'weekly', priority: '0.9' },
    { path: '/about/', changefreq: 'monthly', priority: '0.8' },
    { path: '/login/', changefreq: 'monthly', priority: '0.5' },
  ];

  return pages.map(page => ({
    url: `${SITE_URL}${page.path}`,
    lastmod: new Date().toISOString(),
    changefreq: page.changefreq,
    priority: page.priority,
  }));
}

/**
 * 获取所有文章页面 URL
 */
function getPostPages(): Array<{ url: string; lastmod: string; changefreq: string; priority: string }> {
  const posts: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];
  
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
      const { metadata } = parseFrontmatter(content);
      
      // 获取 slug
      let slug = metadata.slug;
      if (!slug) {
        const filename = path.basename(relativePath, '.md');
        slug = filename.replace(/\s+/g, '-').toLowerCase();
      }
      
      // 获取日期
      const date = metadata.date || new Date().toISOString().split('T')[0];
      
      // 生成链接（对 slug 进行 URL 编码）
      const encodedSlug = encodeURIComponent(slug);
      const url = `${SITE_URL}/post/${encodedSlug}`;
      
      // 判断更新频率（根据文章日期）
      const postDate = new Date(date);
      const daysSincePost = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24);
      let changefreq = 'monthly';
      if (daysSincePost < 30) {
        changefreq = 'weekly';
      } else if (daysSincePost < 7) {
        changefreq = 'daily';
      }
      
      posts.push({
        url,
        lastmod: formatDate(date),
        changefreq,
        priority: '0.8', // 文章页面优先级
      });
    } catch (error) {
      console.error(`Error processing ${relativePath}:`, error);
    }
  }
  
  return posts;
}

/**
 * 生成 sitemap.xml
 */
function generateSitemap(): string {
  const staticPages = getStaticPages();
  const postPages = getPostPages();
  const allPages = [...staticPages, ...postPages];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  for (const page of allPages) {
    xml += `  <url>
    <loc>${escapeXml(page.url)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }
  
  xml += `</urlset>`;
  
  return xml;
}

/**
 * 主函数
 */
function main() {
  console.log('🗺️  Generating sitemap.xml...');
  
  try {
    // 检查站点 URL 配置
    if (SITE_URL === 'https://your-domain.com' || !SITE_URL || SITE_URL.includes('your-domain')) {
      console.warn('⚠️  SITE_URL not properly configured, using default. Set SITE_URL or NEXT_PUBLIC_SITE_URL environment variable, or update constants.ts');
    }
    console.log(`🌐 Using SITE_URL: ${SITE_URL}`);
    
    const sitemapXml = generateSitemap();
    
    // 确保 public 目录存在
    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 写入 XML 文件
    fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
    
    const staticPages = getStaticPages();
    const postPages = getPostPages();
    console.log(`✅ Generated sitemap.xml: ${outputPath}`);
    console.log(`📊 Total URLs: ${staticPages.length + postPages.length}`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Post pages: ${postPages.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { generateSitemap };
