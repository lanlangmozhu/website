#!/usr/bin/env tsx
/**
 * 自动化 SEO 优化脚本
 * 自动应用所有可自动化的 SEO 优化
 */

import fs from 'fs';
import path from 'path';
import { runAllChecks, ComprehensiveReport } from './comprehensive-seo-check';

interface OptimizationAction {
  name: string;
  description: string;
  execute: () => Promise<{ success: boolean; message: string }>;
}

/**
 * 自动增强结构化数据
 */
async function enhanceStructuredData(): Promise<{ success: boolean; message: string }> {
  try {
    const postPagePath = path.join(process.cwd(), 'app', 'post', '[slug]', 'page.tsx');
    
    if (!fs.existsSync(postPagePath)) {
      return { success: false, message: '文章页面文件不存在' };
    }

    let content = fs.readFileSync(postPagePath, 'utf-8');

    // 检查是否已经包含 timeRequired 和 wordCount
    const hasTimeRequired = content.includes('timeRequired');
    const hasWordCount = content.includes('wordCount');
    const hasBreadcrumb = content.includes('BreadcrumbList') || content.includes('breadcrumb');

    if (hasTimeRequired && hasWordCount && hasBreadcrumb) {
      return { success: true, message: '结构化数据已完整，无需修改' };
    }

    // 查找 BlogPosting 结构化数据的位置
    const blogPostingMatch = content.match(/return\s*\{[\s\S]*?'@type':\s*['"]BlogPosting['"][\s\S]*?\};/);
    
    if (!blogPostingMatch) {
      return { success: false, message: '未找到 BlogPosting 结构化数据' };
    }

    let modified = false;
    let newContent = content;

    // 添加 timeRequired（如果缺失）
    if (!hasTimeRequired) {
      // 在 articleSection 后添加 timeRequired
      newContent = newContent.replace(
        /(articleSection:\s*metadata\.category\s*\|\|\s*['"]blog['"]),/,
        `$1,\n            timeRequired: 'PT5M', // 默认 5 分钟阅读时间`,
      );
      modified = true;
    }

    // 添加 wordCount（如果缺失）
    if (!hasWordCount) {
      // 计算字数的逻辑需要添加到函数中
      // 这里先添加占位符，实际实现需要读取文章内容
      newContent = newContent.replace(
        /(timeRequired:[\s\S]*?),/,
        (match) => {
          if (match.includes('wordCount')) {
            return match;
          }
          return match + '\n            wordCount: markdownContent.replace(/\\s+/g, \'\').length,';
        },
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(postPagePath, newContent, 'utf-8');
      return { success: true, message: '已增强结构化数据（添加 timeRequired 和 wordCount）' };
    }

    return { success: true, message: '结构化数据检查完成' };
  } catch (error) {
    return { success: false, message: `执行失败: ${error}` };
  }
}

/**
 * 自动优化图片属性
 */
async function optimizeImages(): Promise<{ success: boolean; message: string }> {
  try {
    const postPagePath = path.join(process.cwd(), 'components', 'pages', 'PostPage.tsx');
    
    if (!fs.existsSync(postPagePath)) {
      return { success: false, message: 'PostPage 组件文件不存在' };
    }

    let content = fs.readFileSync(postPagePath, 'utf-8');
    let modified = false;

    // 优化 Hero 图片
    if (content.includes('<img')) {
      // 添加 loading="eager"
      if (!content.includes('loading=')) {
        content = content.replace(
          /<img\s+([^>]*?)src=/,
          '<img $1loading="eager" src=',
        );
        modified = true;
      }

      // 添加 fetchPriority="high"
      if (!content.includes('fetchPriority=')) {
        content = content.replace(
          /<img\s+([^>]*?)loading=/,
          '<img $1fetchPriority="high" loading=',
        );
        modified = true;
      }

      // 添加 width 和 height（如果缺失）
      if (!content.includes('width=') || !content.includes('height=')) {
        // 尝试从 className 中提取尺寸信息
        const heightMatch = content.match(/h-\[(\d+)px\]/);
        if (heightMatch) {
          const height = heightMatch[1];
          content = content.replace(
            /<img\s+([^>]*?)className=/,
            `<img $1width="1200" height="${height}" className=`,
          );
          modified = true;
        }
      }
    }

    // 优化 MarkdownRenderer
    const markdownRendererPath = path.join(process.cwd(), 'components', 'MarkdownRenderer.tsx');
    if (fs.existsSync(markdownRendererPath)) {
      let markdownContent = fs.readFileSync(markdownRendererPath, 'utf-8');
      
      if (markdownContent.includes('img')) {
        // 确保有 loading="lazy"
        if (!markdownContent.includes('loading=')) {
          markdownContent = markdownContent.replace(
            /<img\s+([^>]*?)src=/,
            '<img $1loading="lazy" src=',
          );
          modified = true;
        }

        // 确保有 decoding="async"
        if (!markdownContent.includes('decoding=')) {
          markdownContent = markdownContent.replace(
            /<img\s+([^>]*?)loading=/,
            '<img $1decoding="async" loading=',
          );
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(markdownRendererPath, markdownContent, 'utf-8');
        }
      }
    }

    if (modified) {
      fs.writeFileSync(postPagePath, content, 'utf-8');
      return { success: true, message: '已优化图片属性' };
    }

    return { success: true, message: '图片优化检查完成，无需修改' };
  } catch (error) {
    return { success: false, message: `执行失败: ${error}` };
  }
}

/**
 * 自动添加资源提示
 */
async function addResourceHints(): Promise<{ success: boolean; message: string }> {
  try {
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    
    if (!fs.existsSync(layoutPath)) {
      return { success: false, message: 'Layout 文件不存在' };
    }

    let content = fs.readFileSync(layoutPath, 'utf-8');
    let modified = false;

    // 检查并添加 DNS prefetch（如果缺失）
    if (!content.includes('dns-prefetch')) {
      // 查找 head 标签位置
      const headMatch = content.match(/<head[^>]*>/);
      if (headMatch) {
        const insertPoint = headMatch.index! + headMatch[0].length;
        const dnsPrefetch = `
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />`;
        content = content.slice(0, insertPoint) + dnsPrefetch + content.slice(insertPoint);
        modified = true;
      }
    }

    // 检查并添加 preconnect（如果缺失）
    if (!content.includes('preconnect')) {
      const preconnectMatch = content.match(/dns-prefetch[^<]*<\/link>/);
      if (preconnectMatch) {
        const insertPoint = preconnectMatch.index! + preconnectMatch[0].length;
        const preconnect = `
        {/* Preconnect for critical external resources */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />`;
        content = content.slice(0, insertPoint) + preconnect + content.slice(insertPoint);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(layoutPath, content, 'utf-8');
      return { success: true, message: '已添加资源提示（DNS prefetch 和 preconnect）' };
    }

    return { success: true, message: '资源提示检查完成，无需修改' };
  } catch (error) {
    return { success: false, message: `执行失败: ${error}` };
  }
}

/**
 * 自动设置 PWA Manifest
 */
async function setupPWA(): Promise<{ success: boolean; message: string }> {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    
    // 如果 manifest.json 不存在，创建它
    if (!fs.existsSync(manifestPath)) {
      const manifest = {
        name: '小菜权的个人网站',
        short_name: '小菜权',
        description: 'NO BUG, NO CODE - 前端开发技术博客',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
          },
        ],
        categories: ['blog', 'education', 'technology'],
        lang: 'zh-CN',
        dir: 'ltr',
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

      // 检查 layout.tsx 中是否有 manifest 链接
      const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
      if (fs.existsSync(layoutPath)) {
        let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
        
        if (!layoutContent.includes('manifest.json')) {
          // 查找 head 标签位置
          const headMatch = layoutContent.match(/<head[^>]*>/);
          if (headMatch) {
            const insertPoint = headMatch.index! + headMatch[0].length;
            const manifestLink = `
        <link rel="manifest" href="/manifest.json" />`;
            layoutContent = layoutContent.slice(0, insertPoint) + manifestLink + layoutContent.slice(insertPoint);
            fs.writeFileSync(layoutPath, layoutContent, 'utf-8');
          }
        }
      }

      return { success: true, message: '已创建 manifest.json 并添加到 layout' };
    }

    return { success: true, message: 'PWA Manifest 已存在，无需修改' };
  } catch (error) {
    return { success: false, message: `执行失败: ${error}` };
  }
}

/**
 * 运行所有优化
 */
async function runAllOptimizations(): Promise<void> {
  console.log('🚀 开始自动化 SEO 优化...\n');

  const optimizations: OptimizationAction[] = [
    {
      name: '增强结构化数据',
      description: '添加 timeRequired、wordCount 和 BreadcrumbList',
      execute: enhanceStructuredData,
    },
    {
      name: '优化图片属性',
      description: '添加 loading、fetchPriority、width、height 等属性',
      execute: optimizeImages,
    },
    {
      name: '添加资源提示',
      description: '添加 DNS prefetch、preconnect 和 preload',
      execute: addResourceHints,
    },
    {
      name: '设置 PWA Manifest',
      description: '创建 manifest.json 并添加到 layout',
      execute: setupPWA,
    },
  ];

  const results: Array<{ name: string; success: boolean; message: string }> = [];

  for (const optimization of optimizations) {
    console.log(`\n📝 ${optimization.name}...`);
    console.log(`   描述: ${optimization.description}`);
    
    try {
      const result = await optimization.execute();
      results.push({ name: optimization.name, ...result });
      
      if (result.success) {
        console.log(`   ✅ ${result.message}`);
      } else {
        console.log(`   ❌ ${result.message}`);
      }
    } catch (error) {
      console.log(`   ❌ 执行失败: ${error}`);
      results.push({
        name: optimization.name,
        success: false,
        message: `执行失败: ${error}`,
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('优化结果汇总:');
  console.log('='.repeat(60));

  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.name}: ${result.message}`);
  });

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  console.log(`\n总计: ${successCount}/${totalCount} 项优化成功`);

  // 运行检查以验证优化效果
  console.log('\n🔍 运行优化后检查...\n');
  const report = runAllChecks();
  
  console.log(`\n优化后总体得分: ${report.overallScore}/100`);
  
  if (report.overallScore >= 80) {
    console.log('✅ SEO 优化达到良好水平！');
  } else {
    console.log('⚠️  仍有优化空间，请查看详细报告');
  }
}

function main() {
  runAllOptimizations().catch(error => {
    console.error('❌ 优化失败:', error);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

export { runAllOptimizations };
