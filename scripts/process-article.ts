#!/usr/bin/env tsx
/**
 * 命令行工具：处理文章 frontmatter
 * 使用方法：
 *   pnpm tsx scripts/process-article.ts <filePath>
 *   pnpm tsx scripts/process-article.ts --all
 */

import fs from 'fs';
import path from 'path';
import { processArticleFrontmatter } from '../utils/frontmatter';

const docsPath = path.join(process.cwd(), 'public', 'docs');

async function processFile(filePath: string) {
  const fullPath = path.join(docsPath, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    return false;
  }

  try {
    console.log(`📝 处理文件: ${filePath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const filename = path.basename(filePath);

    // 显示处理前的状态
    const hasFrontmatter = content.trim().startsWith('---');
    console.log(`   ${hasFrontmatter ? '已有 frontmatter，将补全缺失字段' : '没有 frontmatter，将生成新的'}`);

    const processedContent = await processArticleFrontmatter(
      content,
      filename,
      filePath
    );

    // 写入文件（直接覆盖，frontmatter 会在文件头部）
    fs.writeFileSync(fullPath, processedContent, 'utf-8');
    console.log(`✅ 完成: ${filePath}`);
    console.log(`   Frontmatter 已添加到文件头部`);
    return true;
  } catch (error: any) {
    console.error(`❌ 处理失败 ${filePath}:`, error.message);
    return false;
  }
}

async function processAll() {
  const findMarkdownFiles = (dir: string, basePath: string = ''): string[] => {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath, relativePath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(relativePath);
      }
    }

    return files;
  };

  const markdownFiles = findMarkdownFiles(docsPath);
  console.log(`📚 找到 ${markdownFiles.length} 篇文章\n`);

  let success = 0;
  let failed = 0;

  for (const filePath of markdownFiles) {
    const result = await processFile(filePath);
    if (result) {
      success++;
    } else {
      failed++;
    }
    // 添加延迟避免 API 限流
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 处理完成: 成功 ${success}，失败 ${failed}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
使用方法:
  pnpm tsx scripts/process-article.ts <filePath>  处理单篇文章
  pnpm tsx scripts/process-article.ts --all       处理所有文章

示例:
  pnpm tsx scripts/process-article.ts ai/gemini3-pro-使用感受.md
  pnpm tsx scripts/process-article.ts --all
    `);
    return;
  }

  if (args[0] === '--all') {
    await processAll();
  } else {
    await processFile(args[0]);
  }
}

main().catch(console.error);

