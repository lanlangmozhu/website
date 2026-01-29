import { PostPage } from '../../../components/pages/PostPage';
import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from '../../../utils/markdown';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '../../../constants';

/**
 * 生成所有静态路径（用于静态导出）
 * Next.js 会在构建时调用此函数预生成所有文章页面
 */
export async function generateStaticParams() {
  try {
    // 读取文章列表
    const cwd = process.cwd();
    const postsListPath = path.join(cwd, 'public', 'posts-list.json');
    
    // 调试信息（仅在构建时输出）
    if (process.env.NODE_ENV === 'production') {
      console.log(`[generateStaticParams] Working directory: ${cwd}`);
      console.log(`[generateStaticParams] Looking for posts-list.json at: ${postsListPath}`);
    }
    
    if (!fs.existsSync(postsListPath)) {
      console.warn(`[generateStaticParams] posts-list.json not found at ${postsListPath}, returning empty array`);
      // 尝试查找文件
      const altPath = path.join(cwd, 'posts-list.json');
      if (fs.existsSync(altPath)) {
        console.warn(`[generateStaticParams] Found posts-list.json at alternative location: ${altPath}`);
      }
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
    const docsPath = path.join(cwd, 'public', 'docs');

    if (process.env.NODE_ENV === 'production') {
      console.log(`[generateStaticParams] Docs directory: ${docsPath}`);
      console.log(`[generateStaticParams] Found ${postsList.length} posts in list`);
    }

    // 遍历所有文章文件，提取 slug
    for (const relativePath of postsList) {
      const filePath = path.join(docsPath, relativePath);
      
      if (!fs.existsSync(filePath)) {
        if (process.env.NODE_ENV === 'production') {
          console.warn(`[generateStaticParams] File not found: ${filePath}`);
        }
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

    if (process.env.NODE_ENV === 'production') {
      console.log(`✅ [generateStaticParams] Generated ${slugs.length} static params for posts`);
    }
    return slugs;
  } catch (error) {
    console.error('[generateStaticParams] Error generating static params:', error);
    // 即使出错也返回空数组，避免构建失败
    return [];
  }
}

// 禁用动态参数，只使用 generateStaticParams 生成的静态路径
export const dynamicParams = false;

/**
 * 生成文章页面的 metadata（SEO 优化）
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = slug.includes('%') ? decodeURIComponent(slug) : slug;
  
  try {
    // 读取文章列表
    const cwd = process.cwd();
    const postsListPath = path.join(cwd, 'public', 'posts-list.json');
    
    if (!fs.existsSync(postsListPath)) {
      return {
        title: '文章未找到',
        description: '抱歉，找不到这篇文章',
      };
    }

    const postsList: string[] = JSON.parse(
      fs.readFileSync(postsListPath, 'utf-8')
    );

    const docsPath = path.join(cwd, 'public', 'docs');
    
    // 查找对应的文章文件
    for (const relativePath of postsList) {
      const filePath = path.join(docsPath, relativePath);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { metadata } = parseFrontmatter(content);
        
        // 获取 slug
        let postSlug = metadata.slug;
        if (!postSlug) {
          const filename = path.basename(relativePath, '.md');
          postSlug = filename.replace(/\s+/g, '-').toLowerCase();
        }

        // 如果匹配，生成 metadata
        if (postSlug === decodedSlug || postSlug === slug) {
          const title = metadata.title || '未命名文章';
          const description = metadata.excerpt || metadata.description || title;
          const postUrl = `${SITE_URL}/post/${encodeURIComponent(postSlug)}`;
          const image = metadata.image || `${SITE_URL}/images/og-image.png`;
          
          return {
            title: `${title} | ${SITE_NAME}`,
            description,
            keywords: metadata.tags || [],
            authors: [{ name: metadata.author || SITE_NAME }],
            openGraph: {
              type: 'article',
              url: postUrl,
              title,
              description,
              publishedTime: metadata.date,
              authors: [metadata.author || SITE_NAME],
              tags: metadata.tags || [],
              images: [
                {
                  url: image,
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ],
            },
            twitter: {
              card: 'summary_large_image',
              title,
              description,
              images: [image],
            },
            alternates: {
              canonical: postUrl,
            },
          };
        }
      } catch (error) {
        console.error(`Error processing ${relativePath}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // 默认 metadata
  return {
    title: '文章未找到',
    description: '抱歉，找不到这篇文章',
  };
}

/**
 * 生成文章的结构化数据（JSON-LD）
 */
async function generateStructuredData(slug: string) {
  const decodedSlug = slug.includes('%') ? decodeURIComponent(slug) : slug;
  
  try {
    const cwd = process.cwd();
    const postsListPath = path.join(cwd, 'public', 'posts-list.json');
    
    if (!fs.existsSync(postsListPath)) {
      return null;
    }

    const postsList: string[] = JSON.parse(
      fs.readFileSync(postsListPath, 'utf-8')
    );

    const docsPath = path.join(cwd, 'public', 'docs');
    
    for (const relativePath of postsList) {
      const filePath = path.join(docsPath, relativePath);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { metadata, content: markdownContent } = parseFrontmatter(content);
        
        let postSlug = metadata.slug;
        if (!postSlug) {
          const filename = path.basename(relativePath, '.md');
          postSlug = filename.replace(/\s+/g, '-').toLowerCase();
        }

        if (postSlug === decodedSlug || postSlug === slug) {
          const postUrl = `${SITE_URL}/post/${encodeURIComponent(postSlug)}`;
          const image = metadata.image || `${SITE_URL}/images/og-image.png`;
          
          // 计算字数（去除空白字符）
          const wordCount = markdownContent.replace(/\s+/g, '').length;
          
          // 估算阅读时间（按每分钟 300 字计算）
          const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 300));
          const timeRequired = `PT${readingTimeMinutes}M`;
          
          // 生成面包屑导航
          const category = metadata.category || 'blog';
          const categoryUrl = category === 'blog' ? `${SITE_URL}/blog` : `${SITE_URL}/${category}`;
          
          const breadcrumbList = {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: '首页',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: category === 'blog' ? '博客' : category === 'ai' ? 'AI' : category === 'practice' ? '实践' : '分类',
                item: categoryUrl,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: metadata.title || '未命名文章',
                item: postUrl,
              },
            ],
          };
          
          return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: metadata.title || '未命名文章',
            description: metadata.excerpt || metadata.description || '',
            image: image,
            datePublished: metadata.date || new Date().toISOString(),
            dateModified: metadata.date || new Date().toISOString(),
            author: {
              '@type': 'Person',
              name: metadata.author || SITE_NAME,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_NAME,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/images/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': postUrl,
            },
            keywords: metadata.tags?.join(', ') || '',
            articleSection: metadata.category || 'blog',
            timeRequired: timeRequired,
            wordCount: wordCount,
            breadcrumb: breadcrumbList,
          };
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error('Error generating structured data:', error);
  }

  return null;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const structuredData = await generateStructuredData(slug);
  
  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <PostPage slug={slug} />
    </>
  );
}

