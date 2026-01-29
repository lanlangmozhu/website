import { PostPage } from '../../../components/pages/PostPage';
import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../../../utils/markdown';

/**
 * 生成所有静态路径（用于静态导出）
 * Next.js 会在构建时调用此函数预生成所有文章页面
 */
export async function generateStaticParams() {
  try {
    // 读取文章列表
    const postsListPath = path.join(process.cwd(), 'public', 'posts-list.json');
    
    if (!fs.existsSync(postsListPath)) {
      console.warn('posts-list.json not found, returning empty array');
      return [];
    }

    const postsList: string[] = JSON.parse(
      fs.readFileSync(postsListPath, 'utf-8')
    );

    // 如果文章列表为空，返回一个占位符以确保静态导出正常工作
    if (!Array.isArray(postsList) || postsList.length === 0) {
      console.warn('No posts found in posts-list.json, returning placeholder');
      // 返回一个占位符，页面组件会处理 404
      return [{ slug: '__placeholder__' }];
    }

    const slugs: { slug: string }[] = [];
    const docsPath = path.join(process.cwd(), 'public', 'docs');

    // 遍历所有文章文件，提取 slug
    for (const relativePath of postsList) {
      const filePath = path.join(docsPath, relativePath);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { metadata } = parseFrontmatter(content);
        
        // 优先使用 frontmatter 中的 slug，否则从文件名生成
        let slug = metadata.slug;
        if (!slug) {
          const filename = path.basename(relativePath, '.md');
          slug = filename.replace(/\s+/g, '-').toLowerCase();
        }

        if (slug) {
          slugs.push({ slug });
        }
      } catch (error) {
        console.error(`Error processing ${relativePath}:`, error);
        // 如果解析失败，从文件名生成 slug
        const filename = path.basename(relativePath, '.md');
        slugs.push({ slug: filename.replace(/\s+/g, '-').toLowerCase() });
      }
    }

    console.log(`✅ Generated ${slugs.length} static params for posts`);
    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 禁用动态参数，只使用 generateStaticParams 生成的静态路径
export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostPage slug={slug} />;
}

