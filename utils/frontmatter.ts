/**
 * Frontmatter 工具函数
 * 用于生成、补全和格式化 YAML frontmatter
 */

import { parseFrontmatter } from './markdown';
import { generateFrontmatterWithAI, completeFrontmatter } from '../services/frontmatterService';

/**
 * 将 frontmatter 对象转换为 YAML 字符串
 */
export const formatFrontmatter = (metadata: Record<string, any>): string => {
  const lines: string[] = [];
  
  // 按顺序输出字段
  const fieldOrder = ['slug', 'title', 'excerpt', 'date', 'author', 'readTime', 'tags', 'category', 'subcategory', 'image'];
  
  fieldOrder.forEach(key => {
    if (metadata[key] !== undefined && metadata[key] !== null) {
      const value = metadata[key];
      if (Array.isArray(value)) {
        lines.push(`${key}: [${value.map(v => v.includes(' ') ? `"${v}"` : v).join(', ')}]`);
      } else if (typeof value === 'string' && (value.includes(':') || value.includes(' ') || value.includes('-'))) {
        lines.push(`${key}: ${value}`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    }
  });
  
  // 输出其他字段
  Object.keys(metadata).forEach(key => {
    if (!fieldOrder.includes(key) && metadata[key] !== undefined && metadata[key] !== null) {
      const value = metadata[key];
      if (Array.isArray(value)) {
        lines.push(`${key}: [${value.map(v => v.includes(' ') ? `"${v}"` : v).join(', ')}]`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    }
  });
  
  return lines.join('\n');
};

/**
 * 处理文章内容，自动补全 frontmatter
 * @param content 文章内容
 * @param filename 文件名
 * @param filePath 文件路径
 * @returns 处理后的文章内容（包含完整的 frontmatter）
 */
export const processArticleFrontmatter = async (
  content: string,
  filename: string,
  filePath: string
): Promise<string> => {
  const { metadata, content: articleContent } = parseFrontmatter(content);
  
  let completedMetadata: Record<string, any>;
  
  // 如果已有 frontmatter，补全缺失字段
  if (Object.keys(metadata).length > 0) {
    completedMetadata = await completeFrontmatter(metadata, articleContent, filename, filePath);
  } else {
    // 如果没有 frontmatter，生成新的
    completedMetadata = await generateFrontmatterWithAI(articleContent, filename, filePath);
  }
  
  // 格式化 frontmatter
  const frontmatterYaml = formatFrontmatter(completedMetadata);
  
  // 组合成完整的文章内容（frontmatter 在文件头部）
  // 确保文章内容前有空行
  const contentWithNewline = articleContent.trim();
  return `---\n${frontmatterYaml}\n---\n\n${contentWithNewline}\n`;
};

