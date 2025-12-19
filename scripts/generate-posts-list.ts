#!/usr/bin/env tsx
/**
 * 构建时脚本：生成文章列表 JSON 文件
 * 用于静态导出，替代 API 路由
 * 在构建前运行：pnpm build 会自动调用
 */

import fs from 'fs';
import path from 'path';
import { NAV_CONFIG } from '../constants';

const docsPath = path.join(process.cwd(), 'public', 'docs');
const outputPath = path.join(process.cwd(), 'public', 'posts-list.json');

function generatePostsList(): string[] {
  const allFiles: string[] = [];

  // 遍历所有配置的目录
  for (const config of NAV_CONFIG) {
    const dirPath = path.join(docsPath, config.folder);
    
    if (!fs.existsSync(dirPath)) {
      console.warn(`⚠️  Directory not found: ${dirPath}`);
      continue;
    }

    const files = fs.readdirSync(dirPath);
    const mdFiles = files
      .filter(file => file.endsWith('.md') && !file.startsWith('.'))
      .map(file => `${config.folder}/${file}`);

    allFiles.push(...mdFiles);
    console.log(`✅ Found ${mdFiles.length} files in ${config.folder}/`);
  }

  return allFiles;
}

// 主函数
function main() {
  console.log('📝 Generating posts list for static export...');
  
  try {
    const postsList = generatePostsList();
    
    // 确保 public 目录存在
    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 写入 JSON 文件
    fs.writeFileSync(outputPath, JSON.stringify(postsList, null, 2), 'utf-8');
    
    console.log(`✅ Generated posts list: ${postsList.length} posts`);
    console.log(`📄 Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating posts list:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { generatePostsList };

