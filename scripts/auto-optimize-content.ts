#!/usr/bin/env tsx
/**
 * 文章内容自动化优化脚本
 * 自动修复文章内容层面的 SEO 问题：
 * - 自动生成缺失的 excerpt
 * - 优化 excerpt 长度
 * - 修复标题长度
 * - 添加缺失的 tags
 * - 优化图片 alt 文本
 */

import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../utils/markdown';

const docsPath = path.join(process.cwd(), 'public', 'docs');
const backupPath = path.join(process.cwd(), 'public', 'docs-backup');

interface OptimizationResult {
  file: string;
  changes: string[];
  success: boolean;
  error?: string;
}

interface OptimizationStats {
  total: number;
  optimized: number;
  skipped: number;
  errors: number;
  changes: {
    excerptAdded: number;
    excerptOptimized: number;
    titleFixed: number;
    tagsAdded: number;
    imagesFixed: number;
  };
}

/**
 * 从 Markdown 内容中提取摘要
 */
function extractExcerpt(content: string, targetLength: number = 150): string {
  // 移除代码块、链接、图片等
  let text = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // 移除图片
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/^#+\s+/gm, '') // 移除标题标记
    .replace(/\*\*([^\*]+)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*([^\*]+)\*/g, '$1') // 移除斜体标记
    .replace(/\n+/g, ' ') // 合并换行
    .trim();

  // 提取前几段
  const sentences = text.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
  
  let excerpt = '';
  for (const sentence of sentences) {
    if (excerpt.length + sentence.length > targetLength) {
      break;
    }
    excerpt += sentence + '。';
  }

  // 如果还不够，直接截取
  if (excerpt.length < 50) {
    excerpt = text.substring(0, targetLength).trim();
    // 尝试在句号处截断
    const lastPeriod = excerpt.lastIndexOf('。');
    if (lastPeriod > 50) {
      excerpt = excerpt.substring(0, lastPeriod + 1);
    } else {
      // 如果没有句号，在合适的位置截断
      const lastSpace = excerpt.lastIndexOf(' ');
      if (lastSpace > 50) {
        excerpt = excerpt.substring(0, lastSpace) + '...';
      } else {
        excerpt = excerpt + '...';
      }
    }
  }

  return excerpt.trim();
}

/**
 * 从内容中提取可能的标签
 */
function extractTags(content: string, title: string, category: string): string[] {
  const tags: string[] = [];
  
  // 从分类推导标签
  if (category === 'blog') {
    tags.push('博客');
  } else if (category === 'ai') {
    tags.push('AI');
  } else if (category === 'practice') {
    tags.push('实践');
  }

  // 从标题中提取关键词
  const titleKeywords = title.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];
  const commonTechTerms = ['JavaScript', 'TypeScript', 'React', 'Vue', 'Node', 'CSS', 'HTML', 'Web', '前端', '后端', '算法', '设计模式', '性能', '优化'];
  
  for (const keyword of titleKeywords) {
    if (commonTechTerms.some(term => keyword.includes(term) || term.includes(keyword))) {
      if (!tags.includes(keyword)) {
        tags.push(keyword);
      }
    }
  }

  // 从内容中提取常见技术术语
  const contentLower = content.toLowerCase();
  const techTerms = ['javascript', 'typescript', 'react', 'vue', 'node', 'css', 'html', 'webpack', 'vite', 'es6', 'promise', 'async', 'await'];
  
  for (const term of techTerms) {
    if (contentLower.includes(term) && tags.length < 5) {
      const tag = term.charAt(0).toUpperCase() + term.slice(1);
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
  }

  return tags.slice(0, 5); // 最多5个标签
}

/**
 * 优化单个文章文件
 */
function optimizePost(filePath: string, relativePath: string, dryRun: boolean = false): OptimizationResult {
  const result: OptimizationResult = {
    file: relativePath,
    changes: [],
    success: true,
  };

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, content: markdownContent } = parseFrontmatter(content);

    let newContent = content;
    let modified = false;

    // 1. 检查并生成 excerpt
    if (!metadata.excerpt || metadata.excerpt.trim() === '') {
      const excerpt = extractExcerpt(markdownContent, 150);
      if (excerpt) {
        // 在 frontmatter 中添加 excerpt
        const frontmatterEnd = newContent.indexOf('---', 3);
        if (frontmatterEnd > 0) {
          const frontmatter = newContent.substring(0, frontmatterEnd + 3);
          const afterFrontmatter = newContent.substring(frontmatterEnd + 3);
          
          // 检查是否已有 excerpt 行（空值）
          if (frontmatter.includes('excerpt:')) {
            newContent = frontmatter.replace(/excerpt:\s*.*/m, `excerpt: ${excerpt}`) + afterFrontmatter;
          } else {
            // 在 title 后添加 excerpt
            const titleMatch = frontmatter.match(/title:\s*(.+)/);
            if (titleMatch) {
              const titleEnd = frontmatter.indexOf(titleMatch[0]) + titleMatch[0].length;
              newContent = frontmatter.substring(0, titleEnd) + `\nexcerpt: ${excerpt}` + frontmatter.substring(titleEnd) + afterFrontmatter;
            } else {
              // 如果没有 title，在第一个字段后添加
              const firstLineEnd = frontmatter.indexOf('\n', 3);
              newContent = frontmatter.substring(0, firstLineEnd) + `\nexcerpt: ${excerpt}` + frontmatter.substring(firstLineEnd) + afterFrontmatter;
            }
          }
          modified = true;
          result.changes.push(`添加 excerpt: ${excerpt.substring(0, 50)}...`);
        }
      }
    } else {
      // 优化现有 excerpt 长度
      const excerpt = metadata.excerpt.trim();
      if (excerpt.length < 50) {
        const newExcerpt = extractExcerpt(markdownContent, 150);
        if (newExcerpt.length > excerpt.length) {
          newContent = newContent.replace(/excerpt:\s*.+/m, `excerpt: ${newExcerpt}`);
          modified = true;
          result.changes.push(`优化 excerpt 长度: ${excerpt.length} -> ${newExcerpt.length} 字符`);
        }
      } else if (excerpt.length > 200) {
        const optimizedExcerpt = excerpt.substring(0, 160).trim();
        const lastPeriod = optimizedExcerpt.lastIndexOf('。');
        const finalExcerpt = lastPeriod > 100 ? optimizedExcerpt.substring(0, lastPeriod + 1) : optimizedExcerpt + '...';
        newContent = newContent.replace(/excerpt:\s*.+/m, `excerpt: ${finalExcerpt}`);
        modified = true;
        result.changes.push(`缩短 excerpt: ${excerpt.length} -> ${finalExcerpt.length} 字符`);
      }
    }

    // 2. 检查并修复标题长度
    if (metadata.title && metadata.title.length > 60) {
      const optimizedTitle = metadata.title.substring(0, 57).trim() + '...';
      newContent = newContent.replace(/title:\s*.+/m, `title: ${optimizedTitle}`);
      modified = true;
      result.changes.push(`缩短标题: ${metadata.title.length} -> ${optimizedTitle.length} 字符`);
    }

    // 3. 检查并添加 tags
    if (!metadata.tags || metadata.tags.length === 0) {
      const tags = extractTags(markdownContent, metadata.title || '', metadata.category || 'blog');
      if (tags.length > 0) {
        const tagsStr = `[${tags.map(t => t.includes(' ') ? `"${t}"` : t).join(', ')}]`;
        const frontmatterEnd = newContent.indexOf('---', 3);
        if (frontmatterEnd > 0) {
          const frontmatter = newContent.substring(0, frontmatterEnd + 3);
          const afterFrontmatter = newContent.substring(frontmatterEnd + 3);
          
          if (frontmatter.includes('tags:')) {
            newContent = frontmatter.replace(/tags:\s*\[.*?\]/m, `tags: ${tagsStr}`) + afterFrontmatter;
          } else {
            // 在 category 后添加 tags
            const categoryMatch = frontmatter.match(/category:\s*(.+)/);
            if (categoryMatch) {
              const categoryEnd = frontmatter.indexOf(categoryMatch[0]) + categoryMatch[0].length;
              newContent = frontmatter.substring(0, categoryEnd) + `\ntags: ${tagsStr}` + frontmatter.substring(categoryEnd) + afterFrontmatter;
            } else {
              const firstLineEnd = frontmatter.indexOf('\n', 3);
              newContent = frontmatter.substring(0, firstLineEnd) + `\ntags: ${tagsStr}` + frontmatter.substring(firstLineEnd) + afterFrontmatter;
            }
          }
          modified = true;
          result.changes.push(`添加 tags: ${tags.join(', ')}`);
        }
      }
    }

    // 4. 修复 Markdown 中缺少 alt 的图片
    const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g;
    let imageMatches = [...markdownContent.matchAll(imageRegex)];
    
    for (const match of imageMatches) {
      const alt = match[1];
      const src = match[2];
      
      if (!alt || alt.trim() === '') {
        // 从文件名或路径提取描述
        const filename = path.basename(src, path.extname(src));
        const newAlt = filename.replace(/[-_]/g, ' ') || '文章配图';
        const oldImage = match[0];
        const newImage = `![${newAlt}](${src})`;
        
        // 只在 markdown 内容部分替换（不在 frontmatter 中）
        const frontmatterEnd = newContent.indexOf('---', 3) + 3;
        const markdownPart = newContent.substring(frontmatterEnd);
        const newMarkdownPart = markdownPart.replace(oldImage, newImage);
        newContent = newContent.substring(0, frontmatterEnd) + newMarkdownPart;
        
        modified = true;
        result.changes.push(`修复图片 alt: ${newAlt}`);
      }
    }

    // 保存修改
    if (modified && !dryRun) {
      // 创建备份
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }
      const backupFilePath = path.join(backupPath, relativePath);
      const backupDir = path.dirname(backupFilePath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      fs.copyFileSync(filePath, backupFilePath);

      // 写入新内容
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }

    if (!modified) {
      result.changes.push('无需优化');
    }

  } catch (error) {
    result.success = false;
    result.error = String(error);
  }

  return result;
}

/**
 * 优化所有文章
 */
function optimizeAllPosts(dryRun: boolean = false): OptimizationStats {
  const stats: OptimizationStats = {
    total: 0,
    optimized: 0,
    skipped: 0,
    errors: 0,
    changes: {
      excerptAdded: 0,
      excerptOptimized: 0,
      titleFixed: 0,
      tagsAdded: 0,
      imagesFixed: 0,
    },
  };

  // 读取文章列表
  const postsListPath = path.join(process.cwd(), 'public', 'posts-list.json');
  if (!fs.existsSync(postsListPath)) {
    console.error('❌ posts-list.json not found');
    return stats;
  }

  const relativePaths: string[] = JSON.parse(
    fs.readFileSync(postsListPath, 'utf-8')
  );

  stats.total = relativePaths.length;

  console.log(`\n📝 开始优化 ${stats.total} 篇文章...`);
  if (dryRun) {
    console.log('🔍 预览模式（不会实际修改文件）\n');
  } else {
    console.log('💾 备份目录:', backupPath);
    console.log('✏️  将实际修改文件\n');
  }

  const results: OptimizationResult[] = [];

  for (const relativePath of relativePaths) {
    const filePath = path.join(docsPath, relativePath);
    
    if (!fs.existsSync(filePath)) {
      stats.skipped++;
      continue;
    }

    const result = optimizePost(filePath, relativePath, dryRun);
    results.push(result);

    if (result.success) {
      if (result.changes.some(c => c !== '无需优化')) {
        stats.optimized++;
        
        // 统计具体变化
        result.changes.forEach(change => {
          if (change.includes('添加 excerpt')) stats.changes.excerptAdded++;
          if (change.includes('优化 excerpt')) stats.changes.excerptOptimized++;
          if (change.includes('缩短标题')) stats.changes.titleFixed++;
          if (change.includes('添加 tags')) stats.changes.tagsAdded++;
          if (change.includes('修复图片')) stats.changes.imagesFixed++;
        });
      } else {
        stats.skipped++;
      }
    } else {
      stats.errors++;
      console.error(`❌ ${relativePath}: ${result.error}`);
    }
  }

  // 输出结果
  console.log('\n' + '='.repeat(60));
  console.log('优化结果汇总:');
  console.log('='.repeat(60));
  console.log(`总文章数: ${stats.total}`);
  console.log(`已优化: ${stats.optimized}`);
  console.log(`无需优化: ${stats.skipped}`);
  console.log(`错误: ${stats.errors}`);

  if (stats.optimized > 0) {
    console.log('\n详细变化:');
    console.log(`  - 添加 excerpt: ${stats.changes.excerptAdded}`);
    console.log(`  - 优化 excerpt: ${stats.changes.excerptOptimized}`);
    console.log(`  - 修复标题: ${stats.changes.titleFixed}`);
    console.log(`  - 添加 tags: ${stats.changes.tagsAdded}`);
    console.log(`  - 修复图片: ${stats.changes.imagesFixed}`);
  }

  // 显示需要优化的文章详情
  const optimizedResults = results.filter(r => r.success && r.changes.some(c => c !== '无需优化'));
  if (optimizedResults.length > 0) {
    console.log('\n优化的文章:');
    optimizedResults.forEach(result => {
      console.log(`\n  📄 ${result.file}`);
      result.changes.forEach(change => {
        if (change !== '无需优化') {
          console.log(`     ✓ ${change}`);
        }
      });
    });
  }

  if (!dryRun && stats.optimized > 0) {
    console.log(`\n💾 备份已保存到: ${backupPath}`);
    console.log('💡 如需恢复，请从备份目录复制文件回原位置');
  }

  return stats;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const help = args.includes('--help') || args.includes('-h');

  if (help) {
    console.log(`
文章内容自动化优化脚本

用法:
  pnpm tsx scripts/auto-optimize-content.ts [选项]

选项:
  --dry-run, -d    预览模式，不实际修改文件
  --help, -h       显示帮助信息

功能:
  - 自动生成缺失的 excerpt
  - 优化 excerpt 长度（50-200 字符）
  - 修复过长的标题（>60 字符）
  - 自动添加缺失的 tags
  - 修复缺少 alt 的图片

示例:
  # 预览模式
  pnpm tsx scripts/auto-optimize-content.ts --dry-run

  # 实际优化
  pnpm tsx scripts/auto-optimize-content.ts
`);
    return;
  }

  try {
    optimizeAllPosts(dryRun);
  } catch (error) {
    console.error('❌ 优化失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { optimizeAllPosts, optimizePost, extractExcerpt, extractTags };
