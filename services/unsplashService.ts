/**
 * Unsplash API 服务
 * 用于搜索与文章内容相关的图片
 */

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  description: string | null;
  alt_description: string | null;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

/**
 * 获取随机图片（无需 API key）
 * @param width 图片宽度（默认 1200）
 * @param height 图片高度（默认 600）
 * @returns 随机图片 URL
 */
export const getRandomImage = (
  width: number = 1200,
  height: number = 600
): string => {
  // 使用 Picsum Photos 服务，提供高质量的随机图片，无需 API key
  // 每次请求都会返回不同的随机图片
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/${randomId}/${width}/${height}`;
};

/**
 * 从 Unsplash 搜索图片
 * @param query 搜索关键词
 * @param count 返回数量（默认 1）
 * @returns 图片 URL（来自 images.unsplash.com 或 picsum.photos）或 null
 */
export const searchUnsplashImage = async (
  query: string,
  count: number = 1
): Promise<string | null> => {
  try {
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    
    // 如果没有 API key，返回随机图片
    if (!unsplashAccessKey) {
      console.log('UNSPLASH_ACCESS_KEY not found, using random image instead');
      return getRandomImage(1200, 600);
    }
    
    // 使用 Unsplash 官方 API 搜索
    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=${count}&orientation=landscape`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Client-ID ${unsplashAccessKey}`,
      },
    });
    
    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status} ${response.statusText}, falling back to random image`);
      // API 调用失败时，也返回随机图片
      return getRandomImage(1200, 600);
    }
    
    const data: UnsplashSearchResponse = await response.json();
    if (data.results && data.results.length > 0) {
      // 返回高质量图片 URL（使用 images.unsplash.com）
      const photo = data.results[0];
      // 使用 regular 尺寸，并添加优化参数
      return `${photo.urls.regular}?auto=format&fit=crop&w=1200&q=80`;
    }
    
    // 没有搜索结果时，返回随机图片
    console.log('No Unsplash results found, using random image instead');
    return getRandomImage(1200, 600);
  } catch (error) {
    console.error('Error searching Unsplash:', error);
    // 出错时返回随机图片
    return getRandomImage(1200, 600);
  }
};

/**
 * 根据文章内容生成搜索关键词
 * @param title 文章标题
 * @param content 文章内容
 * @param tags 标签
 * @returns 搜索关键词（简洁的英文关键词）
 */
export const generateImageSearchQuery = (
  title: string,
  content: string,
  tags: string[] = []
): string => {
  // 优先使用标签（通常是英文或技术术语）
  const keywords: string[] = [];
  
  // 添加英文标签（过滤掉中文标签）
  if (tags.length > 0) {
    const englishTags = tags
      .filter(tag => /^[a-zA-Z0-9\s-]+$/.test(tag)) // 只保留英文标签
      .slice(0, 2);
    keywords.push(...englishTags);
  }
  
  // 从标题提取英文关键词或技术术语
  // 移除中文和常见词，保留技术术语
  const titleWords = title
    .replace(/[^\w\s-]/g, ' ') // 移除非字母数字字符
    .split(/\s+/)
    .filter(word => {
      // 保留英文单词和技术术语（长度 >= 2）
      return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(word) && word.length >= 2;
    })
    .slice(0, 2);
  keywords.push(...titleWords);
  
  // 如果关键词不足，使用通用技术相关关键词
  if (keywords.length === 0) {
    // 根据分类使用默认关键词
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('ai') || lowerTitle.includes('gemini') || lowerTitle.includes('agent')) {
      keywords.push('artificial intelligence', 'technology');
    } else if (lowerTitle.includes('前端') || lowerTitle.includes('frontend') || lowerTitle.includes('web')) {
      keywords.push('web development', 'coding');
    } else if (lowerTitle.includes('算法') || lowerTitle.includes('algorithm')) {
      keywords.push('algorithm', 'programming');
    } else if (lowerTitle.includes('css') || lowerTitle.includes('layout')) {
      keywords.push('web design', 'ui');
    } else {
      keywords.push('technology', 'digital');
    }
  }
  
  // 返回简洁的关键词（最多 2-3 个词）
  return keywords.slice(0, 2).join(' ').trim() || 'technology';
};
