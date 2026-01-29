import fs from 'fs';
import path from 'path';

/**
 * 删除构建输出目录中的所有 index.txt 文件
 * Next.js 15 静态导出时会生成 RSC payload 文件，这些文件对静态网站不是必需的
 */
function deleteIndexTxtFiles(dir: string): number {
  let deletedCount = 0;
  
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      deletedCount += deleteIndexTxtFiles(filePath);
    } else if (file === 'index.txt') {
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`✅ 已删除: ${filePath.replace(process.cwd(), '.')}`);
      } catch (error) {
        console.error(`❌ 删除失败: ${filePath}`, error);
      }
    }
  });

  return deletedCount;
}

const outDir = path.join(process.cwd(), 'out');

if (!fs.existsSync(outDir)) {
  console.log('⚠️  out 目录不存在，跳过清理');
  process.exit(0);
}

console.log('🧹 开始清理 index.txt 文件...');
const count = deleteIndexTxtFiles(outDir);
console.log(`✅ 清理完成，共删除 ${count} 个 index.txt 文件`);
