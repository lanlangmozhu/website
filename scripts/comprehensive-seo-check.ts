#!/usr/bin/env tsx
/**
 * 综合 SEO 检查脚本
 * 运行所有 SEO 检查并生成综合报告
 */

import fs from 'fs';
import path from 'path';
import { checkPostSEO } from './optimize-seo';

interface CheckResult {
  name: string;
  passed: boolean;
  issues: string[];
  suggestions: string[];
  score: number; // 0-100
}

interface ComprehensiveReport {
  timestamp: string;
  checks: CheckResult[];
  overallScore: number;
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    criticalIssues: number;
    warnings: number;
  };
}

/**
 * 检查结构化数据
 */
function checkStructuredData(): CheckResult {
  const result: CheckResult = {
    name: '结构化数据检查',
    passed: true,
    issues: [],
    suggestions: [],
    score: 100,
  };

  try {
    const postPagePath = path.join(process.cwd(), 'app', 'post', '[slug]', 'page.tsx');
    if (!fs.existsSync(postPagePath)) {
      result.passed = false;
      result.issues.push('文章页面文件不存在');
      result.score = 0;
      return result;
    }

    const content = fs.readFileSync(postPagePath, 'utf-8');

    // 检查 BlogPosting 结构化数据（支持单引号和双引号）
    if (!content.includes("'@type': 'BlogPosting'") && !content.includes('"@type": "BlogPosting"')) {
      result.passed = false;
      result.issues.push('缺少 BlogPosting 结构化数据');
      result.score -= 30;
    }

    // 检查 timeRequired
    if (!content.includes('timeRequired')) {
      result.issues.push('BlogPosting 缺少 timeRequired 字段');
      result.suggestions.push('添加 timeRequired 字段以提供阅读时间信息');
      result.score -= 10;
    }

    // 检查 wordCount
    if (!content.includes('wordCount')) {
      result.issues.push('BlogPosting 缺少 wordCount 字段');
      result.suggestions.push('添加 wordCount 字段以提供字数统计');
      result.score -= 10;
    }

    // 检查 BreadcrumbList
    if (!content.includes('BreadcrumbList') && !content.includes('breadcrumb')) {
      result.issues.push('缺少面包屑导航结构化数据');
      result.suggestions.push('添加 BreadcrumbList 结构化数据以改善导航和 SEO');
      result.score -= 15;
    }

    // 检查面包屑组件
    const breadcrumbPath = path.join(process.cwd(), 'components', 'Breadcrumb.tsx');
    if (!fs.existsSync(breadcrumbPath)) {
      result.issues.push('缺少 Breadcrumb 组件');
      result.suggestions.push('创建 Breadcrumb 组件以提供视觉导航');
      result.score -= 10;
    }

    if (result.score < 100) {
      result.passed = false;
    }
  } catch (error) {
    result.passed = false;
    result.issues.push(`检查失败: ${error}`);
    result.score = 0;
  }

  return result;
}

/**
 * 检查图片优化
 */
function checkImageOptimization(): CheckResult {
  const result: CheckResult = {
    name: '图片优化检查',
    passed: true,
    issues: [],
    suggestions: [],
    score: 100,
  };

  try {
    const postPagePath = path.join(process.cwd(), 'components', 'pages', 'PostPage.tsx');
    if (!fs.existsSync(postPagePath)) {
      result.passed = false;
      result.issues.push('PostPage 组件文件不存在');
      result.score = 0;
      return result;
    }

    const content = fs.readFileSync(postPagePath, 'utf-8');

    // 检查 Hero 图片优化
    if (content.includes('<img')) {
      if (!content.includes('loading="eager"') && !content.includes("loading='eager'")) {
        result.issues.push('Hero 图片缺少 loading="eager" 属性');
        result.suggestions.push('为 Hero 图片添加 loading="eager" 以优先加载');
        result.score -= 10;
      }

      if (!content.includes('fetchPriority="high"') && !content.includes("fetchPriority='high'")) {
        result.issues.push('Hero 图片缺少 fetchPriority="high" 属性');
        result.suggestions.push('为 Hero 图片添加 fetchPriority="high" 以提升优先级');
        result.score -= 10;
      }

      if (!content.includes('width=') || !content.includes('height=')) {
        result.issues.push('Hero 图片缺少 width 或 height 属性');
        result.suggestions.push('为 Hero 图片添加明确的 width 和 height 以避免 CLS');
        result.score -= 15;
      }
    }

    // 检查 MarkdownRenderer
    const markdownRendererPath = path.join(process.cwd(), 'components', 'MarkdownRenderer.tsx');
    if (fs.existsSync(markdownRendererPath)) {
      const markdownContent = fs.readFileSync(markdownRendererPath, 'utf-8');
      
      if (markdownContent.includes('img')) {
        if (!markdownContent.includes('loading="lazy"') && !markdownContent.includes("loading='lazy'")) {
          result.issues.push('Markdown 图片缺少 loading="lazy" 属性');
          result.suggestions.push('为 Markdown 图片添加 loading="lazy" 以延迟加载');
          result.score -= 10;
        }

        if (!markdownContent.includes('decoding="async"') && !markdownContent.includes("decoding='async'")) {
          result.issues.push('Markdown 图片缺少 decoding="async" 属性');
          result.suggestions.push('为 Markdown 图片添加 decoding="async" 以异步解码');
          result.score -= 5;
        }
      }
    }

    if (result.score < 100) {
      result.passed = false;
    }
  } catch (error) {
    result.passed = false;
    result.issues.push(`检查失败: ${error}`);
    result.score = 0;
  }

  return result;
}

/**
 * 检查资源提示
 */
function checkResourceHints(): CheckResult {
  const result: CheckResult = {
    name: '资源提示检查',
    passed: true,
    issues: [],
    suggestions: [],
    score: 100,
  };

  try {
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    if (!fs.existsSync(layoutPath)) {
      result.passed = false;
      result.issues.push('Layout 文件不存在');
      result.score = 0;
      return result;
    }

    const content = fs.readFileSync(layoutPath, 'utf-8');

    // 检查 DNS prefetch
    if (!content.includes('dns-prefetch')) {
      result.issues.push('缺少 DNS prefetch 链接');
      result.suggestions.push('为外部 CDN 资源添加 dns-prefetch 以加速 DNS 解析');
      result.score -= 15;
    }

    // 检查 preconnect
    if (!content.includes('preconnect')) {
      result.issues.push('缺少 preconnect 链接');
      result.suggestions.push('为关键外部资源添加 preconnect 以建立早期连接');
      result.score -= 15;
    }

    // 检查 preload
    if (!content.includes('preload')) {
      result.issues.push('缺少 preload 链接');
      result.suggestions.push('为关键 CSS/JS 资源添加 preload 以提前加载');
      result.score -= 10;
    }

    // 检查 Highlight.js 预加载
    if (content.includes('highlight.js') && !content.includes('preload')) {
      result.issues.push('Highlight.js 脚本未预加载');
      result.suggestions.push('为 Highlight.js 脚本添加 preload 以提升性能');
      result.score -= 10;
    }

    if (result.score < 100) {
      result.passed = false;
    }
  } catch (error) {
    result.passed = false;
    result.issues.push(`检查失败: ${error}`);
    result.score = 0;
  }

  return result;
}

/**
 * 检查 PWA Manifest
 */
function checkPWAManifest(): CheckResult {
  const result: CheckResult = {
    name: 'PWA Manifest 检查',
    passed: true,
    issues: [],
    suggestions: [],
    score: 100,
  };

  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      result.passed = false;
      result.issues.push('manifest.json 文件不存在');
      result.suggestions.push('创建 manifest.json 文件以支持 PWA');
      result.score -= 50;
    } else {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      
      const requiredFields = ['name', 'short_name', 'start_url', 'display'];
      for (const field of requiredFields) {
        if (!manifest[field]) {
          result.issues.push(`manifest.json 缺少必需字段: ${field}`);
          result.score -= 10;
        }
      }
    }

    // 检查 layout.tsx 中的 manifest 链接
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      if (!layoutContent.includes('manifest.json')) {
        result.issues.push('Layout 中缺少 manifest.json 链接');
        result.suggestions.push('在 layout.tsx 中添加 manifest 链接');
        result.score -= 15;
      }
    }

    // 检查 favicon（允许 .ico 或其他格式，检查根目录和 public 目录）
    const faviconPaths = [
      path.join(process.cwd(), 'favicon.ico'),
      path.join(process.cwd(), 'public', 'favicon.ico'),
      path.join(process.cwd(), 'public', 'favicon.png'),
      path.join(process.cwd(), 'public', 'favicon.svg'),
    ];
    const faviconExists = faviconPaths.some(p => fs.existsSync(p));
    if (!faviconExists) {
      result.issues.push('缺少 favicon 文件（favicon.ico/png/svg）');
      result.suggestions.push('添加 favicon 文件以改善浏览器标签页显示');
      result.score -= 10;
    }

    if (result.score < 100) {
      result.passed = false;
    }
  } catch (error) {
    result.passed = false;
    result.issues.push(`检查失败: ${error}`);
    result.score = 0;
  }

  return result;
}

/**
 * 检查 Meta 标签
 */
function checkMetaTags(): CheckResult {
  const result: CheckResult = {
    name: 'Meta 标签检查',
    passed: true,
    issues: [],
    suggestions: [],
    score: 100,
  };

  try {
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    if (!fs.existsSync(layoutPath)) {
      result.passed = false;
      result.issues.push('Layout 文件不存在');
      result.score = 0;
      return result;
    }

    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    // 检查基本 meta 标签
    if (!layoutContent.includes('metadataBase')) {
      result.issues.push('缺少 metadataBase');
      result.suggestions.push('添加 metadataBase 以设置基础 URL');
      result.score -= 10;
    }

    if (!layoutContent.includes('openGraph')) {
      result.issues.push('缺少 Open Graph 标签');
      result.suggestions.push('添加 Open Graph 标签以改善社交媒体分享');
      result.score -= 15;
    }

    if (!layoutContent.includes('twitter')) {
      result.issues.push('缺少 Twitter Card 标签');
      result.suggestions.push('添加 Twitter Card 标签以改善 Twitter 分享');
      result.score -= 10;
    }

    // 检查文章页面的 meta 标签
    const postPagePath = path.join(process.cwd(), 'app', 'post', '[slug]', 'page.tsx');
    if (fs.existsSync(postPagePath)) {
      const postContent = fs.readFileSync(postPagePath, 'utf-8');
      
      if (!postContent.includes('generateMetadata')) {
        result.issues.push('文章页面缺少 generateMetadata 函数');
        result.suggestions.push('添加 generateMetadata 函数以动态生成 SEO meta 标签');
        result.score -= 20;
      }

      if (!postContent.includes('canonical')) {
        result.issues.push('文章页面缺少 canonical URL');
        result.suggestions.push('添加 canonical URL 以避免重复内容问题');
        result.score -= 10;
      }
    }

    if (result.score < 100) {
      result.passed = false;
    }
  } catch (error) {
    result.passed = false;
    result.issues.push(`检查失败: ${error}`);
    result.score = 0;
  }

  return result;
}

/**
 * 运行所有检查
 */
function runAllChecks(): ComprehensiveReport {
  console.log('🔍 开始综合 SEO 检查...\n');

  const checks: CheckResult[] = [
    checkStructuredData(),
    checkImageOptimization(),
    checkResourceHints(),
    checkPWAManifest(),
    checkMetaTags(),
  ];

  // 运行文章 SEO 检查
  try {
    const postSEOReport = checkPostSEO();
    checks.push({
      name: '文章内容 SEO 检查',
      passed: postSEOReport.issues.filter(i => i.type === 'error').length === 0,
      issues: postSEOReport.issues
        .filter(i => i.type === 'error' || i.type === 'warning')
        .map(i => `${i.file}: ${i.message}`),
      suggestions: postSEOReport.recommendations,
      score: postSEOReport.issues.length === 0 ? 100 : Math.max(0, 100 - postSEOReport.issues.length * 5),
    });
  } catch (error) {
    checks.push({
      name: '文章内容 SEO 检查',
      passed: false,
      issues: [`检查失败: ${error}`],
      suggestions: [],
      score: 0,
    });
  }

  // 计算总分
  const overallScore = Math.round(
    checks.reduce((sum, check) => sum + check.score, 0) / checks.length
  );

  // 统计信息
  const summary = {
    totalChecks: checks.length,
    passedChecks: checks.filter(c => c.passed).length,
    failedChecks: checks.filter(c => !c.passed).length,
    criticalIssues: checks.reduce((sum, c) => sum + c.issues.filter(i => i.includes('不存在') || i.includes('缺少')).length, 0),
    warnings: checks.reduce((sum, c) => sum + c.issues.length, 0),
  };

  return {
    timestamp: new Date().toISOString(),
    checks,
    overallScore,
    summary,
  };
}

/**
 * 输出报告
 */
function printReport(report: ComprehensiveReport): void {
  console.log('='.repeat(60));
  console.log('📊 SEO 综合检查报告');
  console.log('='.repeat(60));
  console.log(`\n时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
  console.log(`\n总体得分: ${report.overallScore}/100`);
  console.log(`\n检查统计:`);
  console.log(`  总检查数: ${report.summary.totalChecks}`);
  console.log(`  通过: ${report.summary.passedChecks}`);
  console.log(`  失败: ${report.summary.failedChecks}`);
  console.log(`  关键问题: ${report.summary.criticalIssues}`);
  console.log(`  警告数: ${report.summary.warnings}`);

  console.log('\n' + '='.repeat(60));
  console.log('详细检查结果:');
  console.log('='.repeat(60));

  report.checks.forEach((check, index) => {
    const status = check.passed ? '✅' : '❌';
    console.log(`\n${index + 1}. ${status} ${check.name} (得分: ${check.score}/100)`);
    
    if (check.issues.length > 0) {
      console.log('   问题:');
      check.issues.forEach(issue => {
        console.log(`     - ${issue}`);
      });
    }

    if (check.suggestions.length > 0) {
      console.log('   建议:');
      check.suggestions.forEach(suggestion => {
        console.log(`     💡 ${suggestion}`);
      });
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('优化建议优先级:');
  console.log('='.repeat(60));

  // 按得分排序，优先显示得分最低的
  const sortedChecks = [...report.checks].sort((a, b) => a.score - b.score);
  
  sortedChecks.forEach((check, index) => {
    if (check.score < 100) {
      console.log(`\n${index + 1}. ${check.name} (当前得分: ${check.score}/100)`);
      if (check.suggestions.length > 0) {
        console.log(`   优先处理: ${check.suggestions[0]}`);
      }
    }
  });

  console.log('\n' + '='.repeat(60));
}

function main() {
  try {
    const report = runAllChecks();
    printReport(report);

    // 保存报告
    const outputPath = path.join(process.cwd(), 'public', 'comprehensive-seo-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n📄 详细报告已保存到: ${outputPath}`);

    // 如果总体得分低于 80，返回非零退出码
    if (report.overallScore < 80) {
      console.log('\n⚠️  总体得分低于 80，建议进行优化');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 检查失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { runAllChecks, ComprehensiveReport };
