import { BlogPost } from '../types';
import { parseFrontmatter } from '../utils/markdown';

export const loadPosts = async (): Promise<BlogPost[]> => {
  try {
    // 静态导出：从 JSON 文件读取文章列表
    // 构建时会生成 public/posts-list.json
    const response = await fetch('/posts-list.json');
    
    if (!response.ok) {
      console.warn('Failed to fetch posts list, falling back to empty list');
      return [];
    }

    const relativePaths: string[] = await response.json();
    
    // Map relative paths (e.g., "blog/post.md") to full fetchable URLs (e.g., "/docs/blog/post.md")
    const postPaths = relativePaths.map(path => `/docs/${path}`);

    const fetchPromises = postPaths.map(async (path) => {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
        }
        const text = await response.text();
        const { metadata, content } = parseFrontmatter(text);

        // Calculate Word Count (Simple estimation for Chinese/English mix)
        const cleanContent = content.replace(/[#*`\[\]()]/g, '').replace(/\s+/g, '');
        const wordCount = cleanContent.length;

        // 直接使用 frontmatter 中的值（所有文章都已通过脚本生成完整的 frontmatter）
        const post: BlogPost = {
          slug: metadata.slug,
          title: metadata.title,
          excerpt: metadata.excerpt,
          date: metadata.date,
          author: metadata.author,
          readTime: metadata.readTime,
          tags: metadata.tags || [],
          category: metadata.category?.toLowerCase() || 'blog', 
          subcategory: metadata.subcategory,
          image: metadata.image,
          content: content,
          wordCount: wordCount
        };
        return post;
      } catch (error) {
        console.error(`Error loading post ${path}:`, error);
        return null;
      }
    });

    const results = await Promise.all(fetchPromises);
    const validPosts = results.filter((p): p is BlogPost => p !== null);

    return validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to load posts:", error);
    return [];
  }
};
