#!/usr/bin/env tsx
/**
 * 构建后验证脚本：检查 SEO 相关文件是否正确生成和复制
 * 验证 sitemap.xml 和 robots.txt 是否存在
 */

import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'out');
const publicDir = path.join(process.cwd(), 'public');

interface FileCheck {
  name: string;
  publicPath: string;
  outPath: string;
  required: boolean;
}

const filesToCheck: FileCheck[] = [
  {
    name: 'sitemap.xml',
    publicPath: path.join(publicDir, 'sitemap.xml'),
    outPath: path.join(outDir, 'sitemap.xml'),
    required: true,
  },
  {
    name: 'robots.txt',
    publicPath: path.join(publicDir, 'robots.txt'),
    outPath: path.join(outDir, 'robots.txt'),
    required: true,
  },
  {
    name: 'rss.xml',
    publicPath: path.join(publicDir, 'rss.xml'),
    outPath: path.join(outDir, 'rss.xml'),
    required: true,
  },
];

function verifyFiles(): boolean {
  console.log('🔍 Verifying SEO files...\n');
  
  let allPassed = true;
  
  for (const file of filesToCheck) {
    const existsInPublic = fs.existsSync(file.publicPath);
    const existsInOut = fs.existsSync(file.outPath);
    
    console.log(`📄 ${file.name}:`);
    
    if (existsInPublic) {
      const publicStats = fs.statSync(file.publicPath);
      console.log(`   ✅ Found in public/ (${(publicStats.size / 1024).toFixed(2)} KB)`);
    } else {
      console.log(`   ❌ Missing in public/`);
      if (file.required) {
        allPassed = false;
      }
    }
    
    if (existsInOut) {
      const outStats = fs.statSync(file.outPath);
      console.log(`   ✅ Found in out/ (${(outStats.size / 1024).toFixed(2)} KB)`);
      
      // 验证文件内容（简单检查）
      if (file.name === 'sitemap.xml') {
        const content = fs.readFileSync(file.outPath, 'utf-8');
        if (!content.includes('<urlset') || !content.includes('</urlset>')) {
          console.log(`   ⚠️  Warning: sitemap.xml may be invalid`);
        } else {
          const urlCount = (content.match(/<url>/g) || []).length;
          console.log(`   📊 Contains ${urlCount} URLs`);
          
          // 检查是否包含主要页面
          const hasHomePage = content.includes(`${process.env.SITE_URL || 'https://lanlangmozhu.com'}/`);
          const hasBlogPage = content.includes('/blog/');
          if (!hasHomePage || !hasBlogPage) {
            console.log(`   ⚠️  Warning: sitemap.xml may be missing important pages`);
          }
        }
      } else if (file.name === 'robots.txt') {
        const content = fs.readFileSync(file.outPath, 'utf-8');
        if (!content.includes('Sitemap:')) {
          console.log(`   ⚠️  Warning: robots.txt missing Sitemap directive`);
        } else {
          // 验证 Sitemap URL 是否正确
          const sitemapMatch = content.match(/Sitemap:\s*(.+)/i);
          if (sitemapMatch) {
            console.log(`   ✅ Sitemap URL: ${sitemapMatch[1].trim()}`);
          }
        }
      } else if (file.name === 'rss.xml') {
        const content = fs.readFileSync(file.outPath, 'utf-8');
        if (!content.includes('<rss') || !content.includes('</rss>')) {
          console.log(`   ⚠️  Warning: rss.xml may be invalid`);
        } else {
          const itemCount = (content.match(/<item>/g) || []).length;
          console.log(`   📊 Contains ${itemCount} RSS items`);
        }
      }
    } else {
      console.log(`   ❌ Missing in out/`);
      if (file.required) {
        allPassed = false;
      }
    }
    
    console.log('');
  }
  
  return allPassed;
}

function main() {
  if (!fs.existsSync(outDir)) {
    console.error('❌ out/ directory not found. Please run build first.');
    process.exit(1);
  }
  
  const passed = verifyFiles();
  
  if (passed) {
    console.log('✅ All SEO files verified successfully!');
    process.exit(0);
  } else {
    console.error('❌ Some required SEO files are missing!');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { verifyFiles };
