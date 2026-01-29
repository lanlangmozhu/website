#!/usr/bin/env tsx
/**
 * SEO 优化脚本：检查并优化网站的 SEO 配置
 * 包括：meta 标签、图片 alt 属性、结构化数据、性能优化等
 */

import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../utils/markdown';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../constants';

const docsPath = path.join(process.cwd(), 'public', 'docs');
const outputPath = path.join(process.cwd(), 'public', 'seo-report.json');

interface SEOIssue {
  type: 'warning' | 'error' | 'info';
  file: string;
  message: string;
  suggestion?: string;
}

interface SEOReport {
  totalPosts: number;
  postsWithImages: number;
  postsWithoutAlt: number;
  postsWithoutExcerpt: number;
  postsWithoutTags: number;
  issues: SEOIssue[];
  recommendations: string[];
}

/**
 * 检查文章 SEO 问题
 */
function checkPostSEO(): SEOReport {
  const report: SEOReport = {
    totalPosts: 0,
    postsWithImages: 0,
    postsWithoutAlt: 0,
    postsWithoutExcerpt: 0,
    postsWithoutTags: 0,
    issues: [],
    recommendations: [],
  };

  // 读取文章列表
  const postsListPath = path.join(process.cwd(), 'public', 'posts-list.json');
  if (!fs.existsSync(postsListPath)) {
    report.issues.push({
      type: 'error',
      file: 'posts-list.json',
      message: 'posts-list.json not found',
    });
    return report;
  }

  const relativePaths: string[] = JSON.parse(
    fs.readFileSync(postsListPath, 'utf-8')
  );

  report.totalPosts = relativePaths.length;

  for (const relativePath of relativePaths) {
    const filePath = path.join(docsPath, relativePath);
    
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { metadata, content: markdownContent } = parseFrontmatter(content);
      
      // 检查图片
      if (metadata.image) {
        report.postsWithImages++;
      }

      // 检查 excerpt
      if (!metadata.excerpt || metadata.excerpt.trim() === '') {
        report.postsWithoutExcerpt++;
        report.issues.push({
          type: 'warning',
          file: relativePath,
          message: 'Missing excerpt/description',
          suggestion: 'Add excerpt in frontmatter for better SEO',
        });
      }

      // 检查 tags
      if (!metadata.tags || metadata.tags.length === 0) {
        report.postsWithoutTags++;
        report.issues.push({
          type: 'warning',
          file: relativePath,
          message: 'Missing tags',
          suggestion: 'Add tags in frontmatter for better categorization',
        });
      }

      // 检查 Markdown 中的图片是否有 alt 文本
      const imageRegex = /!\[([^\]]*)\]\([^\)]+\)/g;
      const images = markdownContent.match(imageRegex) || [];
      const imagesWithoutAlt = images.filter(img => {
        const altMatch = img.match(/!\[([^\]]*)\]/);
        return !altMatch || !altMatch[1] || altMatch[1].trim() === '';
      });

      if (imagesWithoutAlt.length > 0) {
        report.postsWithoutAlt += imagesWithoutAlt.length;
        report.issues.push({
          type: 'warning',
          file: relativePath,
          message: `Found ${imagesWithoutAlt.length} image(s) without alt text`,
          suggestion: 'Add descriptive alt text to all images for accessibility and SEO',
        });
      }

      // 检查标题长度
      if (metadata.title) {
        if (metadata.title.length > 60) {
          report.issues.push({
            type: 'warning',
            file: relativePath,
            message: `Title too long (${metadata.title.length} chars, recommended: <60)`,
            suggestion: 'Keep titles concise for better SEO',
          });
        }
      }

      // 检查 excerpt 长度
      if (metadata.excerpt) {
        if (metadata.excerpt.length < 50) {
          report.issues.push({
            type: 'info',
            file: relativePath,
            message: `Excerpt too short (${metadata.excerpt.length} chars, recommended: 120-160)`,
            suggestion: 'Expand excerpt for better search result snippets',
          });
        } else if (metadata.excerpt.length > 160) {
          report.issues.push({
            type: 'warning',
            file: relativePath,
            message: `Excerpt too long (${metadata.excerpt.length} chars, recommended: 120-160)`,
            suggestion: 'Trim excerpt to optimal length',
          });
        }
      }

    } catch (error) {
      report.issues.push({
        type: 'error',
        file: relativePath,
        message: `Error processing file: ${error}`,
      });
    }
  }

  // 生成建议
  if (report.postsWithoutExcerpt > 0) {
    report.recommendations.push(`Add excerpts to ${report.postsWithoutExcerpt} posts for better SEO`);
  }
  if (report.postsWithoutTags > 0) {
    report.recommendations.push(`Add tags to ${report.postsWithoutTags} posts for better categorization`);
  }
  if (report.postsWithoutAlt > 0) {
    report.recommendations.push(`Add alt text to ${report.postsWithoutAlt} images for accessibility and SEO`);
  }

  return report;
}

/**
 * 生成 SEO 报告
 */
function generateSEOReport(): void {
  console.log('🔍 Analyzing SEO configuration...\n');

  const report = checkPostSEO();

  // 输出统计信息
  console.log('📊 SEO Statistics:');
  console.log(`   Total posts: ${report.totalPosts}`);
  console.log(`   Posts with images: ${report.postsWithImages}`);
  console.log(`   Posts without excerpt: ${report.postsWithoutExcerpt}`);
  console.log(`   Posts without tags: ${report.postsWithoutTags}`);
  console.log(`   Images without alt: ${report.postsWithoutAlt}`);
  console.log('');

  // 输出问题
  if (report.issues.length > 0) {
    console.log('⚠️  SEO Issues Found:');
    const errors = report.issues.filter(i => i.type === 'error');
    const warnings = report.issues.filter(i => i.type === 'warning');
    const infos = report.issues.filter(i => i.type === 'info');

    if (errors.length > 0) {
      console.log(`\n   ❌ Errors (${errors.length}):`);
      errors.forEach(issue => {
        console.log(`      - ${issue.file}: ${issue.message}`);
      });
    }

    if (warnings.length > 0) {
      console.log(`\n   ⚠️  Warnings (${warnings.length}):`);
      warnings.slice(0, 10).forEach(issue => {
        console.log(`      - ${issue.file}: ${issue.message}`);
        if (issue.suggestion) {
          console.log(`        💡 ${issue.suggestion}`);
        }
      });
      if (warnings.length > 10) {
        console.log(`      ... and ${warnings.length - 10} more warnings`);
      }
    }

    if (infos.length > 0) {
      console.log(`\n   ℹ️  Info (${infos.length}):`);
      infos.slice(0, 5).forEach(issue => {
        console.log(`      - ${issue.file}: ${issue.message}`);
      });
      if (infos.length > 5) {
        console.log(`      ... and ${infos.length - 5} more info items`);
      }
    }
  } else {
    console.log('✅ No SEO issues found!');
  }

  // 输出建议
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      console.log(`   - ${rec}`);
    });
  }

  // 保存报告到文件
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📄 SEO report saved to: ${outputPath}`);
}

function main() {
  try {
    generateSEOReport();
  } catch (error) {
    console.error('❌ Error generating SEO report:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { generateSEOReport, checkPostSEO };
