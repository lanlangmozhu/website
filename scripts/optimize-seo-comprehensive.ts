#!/usr/bin/env tsx
/**
 * 综合 SEO 优化脚本
 * 整合所有 SEO 相关的检查和优化步骤
 */

import { execSync } from 'child_process';
import { generateSEOReport } from './optimize-seo';
import { runAllChecks } from './comprehensive-seo-check';

interface Step {
  name: string;
  script: string;
  description: string;
  required: boolean;
  skipIfError?: boolean;
}

const steps: Step[] = [
  {
    name: '生成 Sitemap',
    script: 'generate-sitemap',
    description: '生成 sitemap.xml 文件',
    required: true,
  },
  {
    name: '生成 RSS',
    script: 'generate-rss',
    description: '生成 rss.xml 文件',
    required: true,
  },
  {
    name: '文章 SEO 检查',
    script: 'optimize-seo',
    description: '检查文章 SEO 问题并生成报告',
    required: true,
  },
  {
    name: '综合 SEO 检查',
    script: 'check:seo',
    description: '运行综合 SEO 检查',
    required: false,
    skipIfError: true,
  },
];

/**
 * 运行单个步骤
 */
function runStep(step: Step, dryRun: boolean = false): { success: boolean; message: string } {
  if (dryRun) {
    return { success: true, message: `[预览] 将运行: ${step.description}` };
  }

  try {
    console.log(`\n📝 ${step.name}...`);
    console.log(`   描述: ${step.description}`);
    
    execSync(`pnpm ${step.script}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    return { success: true, message: `${step.name} 完成` };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (step.skipIfError) {
      console.log(`   ⚠️  跳过（非必需步骤）: ${errorMsg}`);
      return { success: true, message: `${step.name} 跳过` };
    }
    return { success: false, message: `${step.name} 失败: ${errorMsg}` };
  }
}

/**
 * 运行所有 SEO 优化步骤
 */
function runAllSteps(dryRun: boolean = false, skipContentOptimization: boolean = false): void {
  console.log('🚀 开始综合 SEO 优化...\n');
  
  if (dryRun) {
    console.log('🔍 预览模式（不会实际执行）\n');
  }

  const results: Array<{ step: string; success: boolean; message: string }> = [];
  let hasErrors = false;

  // 运行主要步骤
  for (const step of steps) {
    const result = runStep(step, dryRun);
    results.push({ step: step.name, ...result });
    
    if (!result.success && step.required) {
      hasErrors = true;
      console.error(`\n❌ ${result.message}`);
      if (!dryRun) {
        console.error('⚠️  必需步骤失败，停止执行');
        break;
      }
    }
  }

  // 可选：文章内容优化（需要用户确认）
  if (!dryRun && !skipContentOptimization) {
    console.log('\n' + '='.repeat(60));
    console.log('可选步骤: 文章内容自动化优化');
    console.log('='.repeat(60));
    console.log('这将自动修复文章内容层面的 SEO 问题：');
    console.log('  - 自动生成缺失的 excerpt');
    console.log('  - 优化 excerpt 长度');
    console.log('  - 修复过长的标题');
    console.log('  - 自动添加缺失的 tags');
    console.log('  - 修复缺少 alt 的图片');
    console.log('\n💡 提示: 运行 "pnpm optimize:content:dry" 预览优化效果');
    console.log('💡 提示: 运行 "pnpm optimize:content" 执行实际优化');
  }

  // 输出总结
  console.log('\n' + '='.repeat(60));
  console.log('SEO 优化总结');
  console.log('='.repeat(60));

  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.step}: ${result.message}`);
  });

  if (hasErrors && !dryRun) {
    console.log('\n❌ 部分步骤失败，请检查错误信息');
    process.exit(1);
  } else {
    console.log('\n✅ SEO 优化完成！');
    console.log('\n📊 下一步建议:');
    console.log('  1. 查看 SEO 报告: public/seo-report.json');
    console.log('  2. 查看综合检查报告: public/comprehensive-seo-report.json');
    console.log('  3. 如需优化文章内容，运行: pnpm optimize:content');
    console.log('  4. 构建项目验证: pnpm build');
  }
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const skipContent = args.includes('--skip-content') || args.includes('-s');
  const help = args.includes('--help') || args.includes('-h');

  if (help) {
    console.log(`
综合 SEO 优化脚本

用法:
  pnpm optimize:seo [选项]

选项:
  --dry-run, -d          预览模式，不实际执行
  --skip-content, -s    跳过文章内容优化提示
  --help, -h            显示帮助信息

执行的步骤:
  1. 生成 sitemap.xml
  2. 生成 rss.xml
  3. 文章 SEO 检查（生成报告）
  4. 综合 SEO 检查（可选）

示例:
  # 预览模式
  pnpm optimize:seo --dry-run

  # 实际执行
  pnpm optimize:seo

  # 跳过内容优化提示
  pnpm optimize:seo --skip-content
`);
    return;
  }

  try {
    runAllSteps(dryRun, skipContent);
  } catch (error) {
    console.error('❌ SEO 优化失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { runAllSteps };
