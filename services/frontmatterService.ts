/**
 * Frontmatter 生成和补全服务
 * 使用 Gemini AI 生成文章元数据
 */

import { GoogleGenAI } from "@google/genai";
import { searchUnsplashImage, generateImageSearchQuery } from "./unsplashService";
import { NAV_CONFIG } from "../constants";

interface FrontmatterData {
  slug?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  author?: string;
  readTime?: string;
  tags?: string[];
  category?: string;
  subcategory?: string;
  image?: string;
}

/**
 * 使用 AI 生成文章元数据
 */
export const generateFrontmatterWithAI = async (
  content: string,
  filename: string,
  filePath: string
): Promise<FrontmatterData> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // 从文件路径推导分类
    let derivedCategory = 'blog';
    for (const config of NAV_CONFIG) {
      if (filePath.includes(`/${config.folder}/`)) {
        derivedCategory = config.key;
        break;
      }
    }

    // 从文件名生成 slug
    const slug = filename.replace('.md', '').replace(/\s+/g, '-').toLowerCase();

    // 计算阅读时间（基于中文字符数）
    const wordCount = content.replace(/[#*`\[\]()\n\r]/g, '').replace(/\s+/g, '').length;
    const readTime = Math.max(1, Math.ceil(wordCount / 300)); // 假设每分钟 300 字

    // 使用 AI 生成标题、摘要和标签
    const prompt = `请分析以下文章内容，生成以下信息（使用中文）：
1. title: 文章标题（简洁有力，不超过 20 字）
2. excerpt: 文章摘要（2-3 句话，不超过 100 字）
3. tags: 3-5 个标签（数组格式，用中文）

文章内容：
${content.substring(0, 2000)}...

请以 JSON 格式返回，格式如下：
{
  "title": "文章标题",
  "excerpt": "文章摘要",
  "tags": ["标签1", "标签2", "标签3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiText = response.text || '';
    
    // 尝试解析 JSON 响应
    let aiData: Partial<FrontmatterData> = {};
    try {
      // 提取 JSON 部分
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Failed to parse AI response as JSON, using fallback');
      // 如果解析失败，使用简单提取
      const titleMatch = aiText.match(/title["\s:：]+["']?([^"'\n]+)["']?/i);
      const excerptMatch = aiText.match(/excerpt["\s:：]+["']?([^"'\n]+)["']?/i);
      if (titleMatch) aiData.title = titleMatch[1].trim();
      if (excerptMatch) aiData.excerpt = excerptMatch[1].trim();
    }

    // 生成图片搜索关键词并获取图片
    const searchQuery = generateImageSearchQuery(
      aiData.title || filename,
      content,
      aiData.tags || []
    );
    const imageUrl = await searchUnsplashImage(searchQuery);

    // 构建完整的 frontmatter 数据
    const frontmatter: FrontmatterData = {
      slug: slug,
      title: aiData.title || filename.replace('.md', ''),
      excerpt: aiData.excerpt || content.substring(0, 100).replace(/\n/g, ' '),
      date: new Date().toISOString().split('T')[0],
      author: '小菜权',
      readTime: `${readTime} 分钟`,
      tags: aiData.tags || [],
      category: derivedCategory,
      subcategory: undefined,
      image: imageUrl || undefined,
    };

    return frontmatter;
  } catch (error) {
    console.error('Error generating frontmatter with AI:', error);
    // 返回基础数据
    const slug = filename.replace('.md', '').replace(/\s+/g, '-').toLowerCase();
    const wordCount = content.replace(/[#*`\[\]()\n\r]/g, '').replace(/\s+/g, '').length;
    const readTime = Math.max(1, Math.ceil(wordCount / 300));
    
    return {
      slug,
      title: filename.replace('.md', ''),
      excerpt: content.substring(0, 100).replace(/\n/g, ' '),
      date: new Date().toISOString().split('T')[0],
      author: '小菜权',
      readTime: `${readTime} 分钟`,
      tags: [],
      category: 'blog',
    };
  }
};

/**
 * 补全现有的 frontmatter
 */
export const completeFrontmatter = async (
  existingMetadata: Record<string, any>,
  content: string,
  filename: string,
  filePath: string
): Promise<FrontmatterData> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  // 从文件路径推导分类
  let derivedCategory = 'blog';
  for (const config of NAV_CONFIG) {
    if (filePath.includes(`/${config.folder}/`)) {
      derivedCategory = config.key;
      break;
    }
  }

  // 计算阅读时间
  const wordCount = content.replace(/[#*`\[\]()\n\r]/g, '').replace(/\s+/g, '').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 300));

  // 补全缺失的字段
  const completed: FrontmatterData = {
    slug: existingMetadata.slug || filename.replace('.md', '').replace(/\s+/g, '-').toLowerCase(),
    title: existingMetadata.title,
    excerpt: existingMetadata.excerpt,
    date: existingMetadata.date || new Date().toISOString().split('T')[0],
    author: existingMetadata.author || '小菜权',
    readTime: existingMetadata.readTime || `${readTime} 分钟`,
    tags: existingMetadata.tags || [],
    category: existingMetadata.category || derivedCategory,
    subcategory: existingMetadata.subcategory,
    image: existingMetadata.image,
  };

  // 如果缺少摘要或标签，使用 AI 生成
  if (!completed.excerpt || !completed.tags || completed.tags.length === 0) {
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `请为以下文章生成摘要和标签（使用中文）：

标题：${completed.title || filename}

内容：
${content.substring(0, 2000)}...

请以 JSON 格式返回：
{
  "excerpt": "2-3 句话的摘要，不超过 100 字",
  "tags": ["标签1", "标签2", "标签3"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const aiText = response.text || '';
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiData = JSON.parse(jsonMatch[0]);
          if (!completed.excerpt && aiData.excerpt) {
            completed.excerpt = aiData.excerpt;
          }
          if ((!completed.tags || completed.tags.length === 0) && aiData.tags) {
            completed.tags = aiData.tags;
          }
        }
      } catch (error) {
        console.error('Error generating missing fields with AI:', error);
      }
    }
  }

  // 如果缺少图片，从 Unsplash 搜索
  if (!completed.image) {
    const searchQuery = generateImageSearchQuery(
      completed.title || filename,
      content,
      completed.tags || []
    );
    const imageUrl = await searchUnsplashImage(searchQuery);
    if (imageUrl) {
      completed.image = imageUrl;
    }
  }

  return completed;
};

